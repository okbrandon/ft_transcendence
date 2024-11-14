import logging
import urllib.parse
import json
import asyncio

from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import sync_to_async

from django.db.models import Q
from django.utils import timezone
from django.core.cache import cache

from ..models import User, Relationship
from ..util import get_safe_profile, get_user_id_from_token
from ..serializers import UserSerializer

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class StatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = None
        self.heartbeat_task = None
        self.failed_heartbeats = 0
        self.first_heartbeat = True

        query_string = self.scope['query_string'].decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token is None:
            await self.close()
            return

        userID = await get_user_id_from_token(token)

        if userID is None:
            await self.close()
            return

        self.user = await sync_to_async(User.objects.get)(userID=userID)
        self.user_group_name = f"status_{self.user.userID}"

        connection_count_key = f"status_user_connections_{self.user.userID}"
        connection_count = cache.get(connection_count_key, 0)
        cache.set(connection_count_key, connection_count + 1, timeout=None)

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()
        self.heartbeat_task = asyncio.create_task(self.check_heartbeat())

    async def disconnect(self, close_code):

        if self.heartbeat_task and not self.heartbeat_task.done():
            self.heartbeat_task.cancel()
        if self.user is not None:
            connection_count_key = f"status_user_connections_{self.user.userID}"
            connection_count = cache.get(connection_count_key, 0) - 1

            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

            if connection_count > 0:
                cache.set(connection_count_key, connection_count, timeout=None)
            else:
                cache.delete(connection_count_key)
                await self.update_user_status(False, None)
                await self.notify_friends_connection(self.user)

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            message_type = json_data.get("type", None)

            if not message_type:
                raise Exception("Missing message type")

            match message_type:
                case "heartbeat":
                    activity = json_data.get("activity", None)

                    if activity is None:
                        raise Exception("Missing activity")
                    if activity not in ["HOME", "QUEUEING", "PLAYING_VS_AI", "PLAYING_MULTIPLAYER", "PLAYING_LOCAL"]:
                        raise Exception("Invalid activity, not in [HOME, QUEUEING, PLAYING_VS_AI, PLAYING_MULTIPLAYER, PLAYING_LOCAL]")

                    self.failed_heartbeats = 0
                    await self.update_user_status(True, activity)

                    if self.first_heartbeat:
                        await self.notify_friends_connection(self.user)
                        self.first_heartbeat = False

                case _:
                    raise Exception(f"Invalid message type: {message_type}")

        except Exception as err:
            try:
                await self.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON",
                    "more_info": str(err)
                }))
            except Exception as _:
                pass

    @sync_to_async
    def update_user_status(self, online, activity):
        try:
            self.user = User.objects.get(userID=self.user.userID)
        except User.DoesNotExist:
            return

        self.user.status = {
            "online": online,
            "activity": activity,
            "last_seen": timezone.now().isoformat()
        }
        self.user.save()

    async def notify_friends_connection(self, user):
        friends = await sync_to_async(list)(
            Relationship.objects.filter(
                Q(userA=user.userID) | Q(userB=user.userID),
                status=1
            )
        )

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != user.userID else relationship.userB

            try:
                friend = await sync_to_async(User.objects.get)(userID=friend_id)
            except User.DoesNotExist:
                continue

            await self.channel_layer.group_send(
                f"status_{friend.userID}",
                {
                    "type": "connection_event",
                    "user": get_safe_profile(UserSerializer(user).data, me=False)
                }
            )

    async def connection_event(self, event):
        try:
            await self.send(json.dumps({
                "type": "connection_event",
                "user": event["user"]
            }))
        except Exception as _:
            pass

    async def check_heartbeat(self):
        while True:
            self.failed_heartbeats += 1

            if self.failed_heartbeats >= 3:
                logger.warning(f"[{self.__class__.__name__}] User {self.user.username} missed 3 heartbeats, closing connection")
                await self.close(code=4000)
                break

            try:
                await self.send(json.dumps({
                    "type": "heartbeat"
                }))
            except Exception as _:
                pass
            await asyncio.sleep(2)
