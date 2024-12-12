import urllib.parse
import httpx
import json
import os

from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import sync_to_async

from django.db.models import Q, Count
from django.core.cache import cache

from ..models import Conversation, User, Relationship
from ..util import generate_id, get_safe_profile, get_user_id_from_token
from ..serializers import UserSerializer, MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = None

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
        self.user_group_name = f"chat_{self.user.userID}"

        connection_count_key = f"chat_user_connections_{self.user.userID}"
        connection_count = cache.get(connection_count_key, 0)
        cache.set(connection_count_key, connection_count + 1, timeout=None)

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        if connection_count <= 0:
            await self.ensure_conversations_exist(self.user)
        await self.accept()

    async def disconnect(self, close_code):
        if self.user:
            connection_count_key = f"chat_user_connections_{self.user.userID}"
            connection_count = cache.get(connection_count_key, 0) - 1

            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

            if connection_count > 0:
                cache.set(connection_count_key, connection_count, timeout=None)
            else:
                cache.delete(connection_count_key)

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            message_type = json_data.get("type", None)

            if not message_type:
                raise Exception("Missing message type")

            match message_type:
                case "send_message":
                    conversation_id = json_data.get("conversationID", None)
                    content = json_data.get("content", None)

                    if self.user is None:
                        raise Exception("Something went wrong when receiving the message")
                    if conversation_id is None:
                        raise Exception("Missing conversation ID")
                    if content is None:
                        raise Exception("Missing content")
                    if len(content) > 256:
                        raise Exception("Message content exceeds 256 characters")

                    message = await self.add_message_to_conversation(conversation_id, self.user, content)
                    await self.notify_new_message(conversation_id, self.user, message)

                    # Check if the message is for the AI user
                    conversation = await sync_to_async(Conversation.objects.get)(conversationID=conversation_id)
                    participants = await sync_to_async(list)(conversation.participants.all())
                    ai_user = next((user for user in participants if user.userID == "user_ai"), None)

                    if ai_user:
                        ai_response = await self.get_ai_response(content, conversation_id)
                        ai_message = await self.add_message_to_conversation(conversation_id, ai_user, ai_response)
                        await self.notify_new_message(conversation_id, ai_user, ai_message)

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

    async def notify_new_message(self, conversation_id, sender, message):
        conversation = await sync_to_async(Conversation.objects.get)(conversationID=conversation_id)

        if not conversation:
            raise Exception(f"Conversation {conversation_id} not found")

        participants = await sync_to_async(list)(conversation.participants.all())
        safe_profile = get_safe_profile(UserSerializer(sender).data, me=False)

        for participant in participants:
            participant_group_name = f"chat_{participant.userID}"

            await self.channel_layer.group_send(
                participant_group_name,
                {
                    "type": "conversation_update",
                    "conversationID": conversation_id,
                    "sender": safe_profile,
                    "message": MessageSerializer(message).data
                }
            )

    async def conversation_update(self, event):
        try:
            await self.send(json.dumps({
                "type": "conversation_update",
                "conversationID": event["conversationID"],
                "sender": event["sender"],
                "message": event["message"]
            }))
        except Exception as _:
            pass

    async def friend_request(self, event):
        try:
            if event["status"] == "accepted":
                await self.ensure_conversations_exist(self.user)

            await self.send(json.dumps({
                "type": "friend_request",
                "status": event["status"],
                "data": event["data"]
            }))
        except Exception as _:
            pass

    async def upcoming_match(self, event):
        try:
            await self.send(json.dumps({
                "type": "upcoming_match",
                "message": event["message"]
            }))
        except Exception as _:
            pass

    async def challenge_update(self, event):
        try:
            await self.send(json.dumps({
                "type": "challenge_update",
                "invite": event["invite"]
            }))
        except Exception as _:
            pass

    @sync_to_async
    def add_message_to_conversation(self, conversation_id, user, content):
        conversation = Conversation.objects.get(conversationID=conversation_id)

        if not conversation:
            raise Exception(f"Conversation {conversation_id} not found")

        if user not in conversation.participants.all():
            raise Exception(f"User {user.username} is not part of conversation {conversation_id}")

        message = conversation.messages.create(messageID=generate_id("msg"), sender=user, content=content)
        conversation.save()
        return message

    @sync_to_async
    def ensure_conversations_exist(self, user):
        # If the user is not friend with AI yet, create a Relationship
        try:
            ai_user = User.objects.get(userID="user_ai")

            if not Relationship.objects.filter(
                Q(userA=user.userID, userB=ai_user.userID) | Q(userA=ai_user.userID, userB=user.userID)
            ).exists():
                Relationship.objects.create(userA=user.userID, userB=ai_user.userID, status=1)
        except Exception as _:
            pass

        friends = Relationship.objects.filter(
            Q(userA=user.userID) | Q(userB=user.userID)
        )
        friends = friends.exclude(
            Q(status=2) | Q(status=0),
            Q(userA=user.userID) | Q(userB=user.userID)
        )

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != user.userID else relationship.userB

            try:
                friend = User.objects.get(userID=friend_id)
            except User.DoesNotExist:
                continue

            existing_conversation = Conversation.objects.filter(
                participants__userID__in=[user.userID, friend_id],
                conversationType='private_message'
            ).annotate(participant_count=Count('participants')).filter(participant_count=2).exists()

            if not existing_conversation:
                new_conversation = Conversation.objects.create(conversationID=generate_id("conv"), conversationType='private_message')
                new_conversation.receipientID = user.userID
                new_conversation.participants.add(user, friend)
                new_conversation.save()

    async def get_ai_response(self, prompt, conversation_id):
        chat_completion_token = os.environ.get('CHAT_COMPLETION_TOKEN')
        if not chat_completion_token:
            return "Chat with Prune is disabled for this demo environment."

        url = "https://ai.evan.sh/api/completion"
        headers = {
            "Authorization": f"Bearer {chat_completion_token}",
            "Content-Type": "application/json"
        }
        data = {
            "prompt": prompt,
            "conversation_id": conversation_id
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            response.raise_for_status()
            return response.json()["completion"]
