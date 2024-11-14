import asyncio
import jwt
import logging
import time
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from django.db.models import Q

from ..models import User, Tournament, Match
from ..util import get_safe_profile, generate_id
from ..serializers import UserSerializer, MatchSerializer

from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class TournamentManager:
    def __init__(self, tournament):
        self.tournament = tournament
        self.matches = []
        self.channel_layer = get_channel_layer()
        self.last_start_next_match = 0

    @classmethod
    async def get_tournament(cls, tournament_id):
        tournament = await sync_to_async(Tournament.objects.get)(tournamentID=tournament_id)
        return cls(tournament)

    async def setup_tournament(self):
        lock_key = f"tournament_setup_{self.tournament.tournamentID}"
        if not await self.add_lock(lock_key):
            return await self.wait_for_setup()

        try:
            if await self.get_setup_done():
                matches = await self.get_matches()
            else:
                await self.start_tournament()
                await self.create_all_matches()
                await self.set_setup_done()
                matches = await self.get_matches()

            tournament_data = await self.get_tournament_data()
            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {
                    "type": "s_tournament_ready",
                    "tournament_data": tournament_data,
                    "matches": matches
                }
            )
            await self.start_next_match()
            return matches
        finally:
            await self.delete_lock(lock_key)

    @sync_to_async
    def create_all_matches(self):
        participants = list(self.tournament.participants.all())
        num_participants = len(participants)
        num_rounds = (num_participants - 1).bit_length()
        total_matches = 2**num_rounds - 1

        matches = []
        for i in range(total_matches):
            if i < num_participants // 2:
                player1 = participants[i*2]
                player2 = participants[i*2+1] if i*2+1 < num_participants else None
            else:
                player1 = player2 = None

            match = {
                "matchID": generate_id("match"),
                "players": [
                    get_safe_profile(UserSerializer(player).data, me=False) if player else None
                    for player in [player1, player2]
                ]
            }
            matches.append(match)

            match_obj = Match.objects.create(
                matchID=match['matchID'],
                tournament=self.tournament,
                flags=4,
                startedAt=None,
                playerA={"id": player1.userID, "platform": "web"} if player1 else None,
                playerB={"id": player2.userID, "platform": "web"} if player2 else None
            )
            if player1:
                match_obj.whitelist.add(player1)
            if player2:
                match_obj.whitelist.add(player2)
            match_obj.save()

    @sync_to_async
    def add_lock(self, lock_key):
        return cache.add(lock_key, "locked", timeout=60)

    @sync_to_async
    def delete_lock(self, lock_key):
        cache.delete(lock_key)

    @sync_to_async
    def get_setup_done(self):
        return cache.get(f"tournament_setup_done_{self.tournament.tournamentID}")

    @sync_to_async
    def set_setup_done(self):
        cache.set(f"tournament_setup_done_{self.tournament.tournamentID}", True, timeout=None)

    @sync_to_async
    def get_matches(self):
        matches = Match.objects.filter(tournament=self.tournament).order_by('startedAt')
        result = []
        for match in matches:
            serialized_match = MatchSerializer(match).data
            players = [get_safe_profile(UserSerializer(user).data, me=False) for user in match.whitelist.all()]
            result.append({
                'matchID': serialized_match['matchID'],
                'players': players,
                'playerA': serialized_match['playerA'],
                'playerB': serialized_match['playerB'],
                'scores': serialized_match['scores'],
                'winnerID': serialized_match['winnerID'],
                'startedAt': serialized_match['startedAt'],
                'finishedAt': serialized_match['finishedAt'],
                'flags': serialized_match['flags']
            })
        return result

    async def wait_for_setup(self):
        # Wait for up to 30 seconds for the tournament setup to complete
        for _ in range(30):
            if await self.get_setup_done():
                return await self.get_matches()
            await asyncio.sleep(1)
        return None

    @sync_to_async
    def start_tournament(self):
        if self.tournament.status != 'PENDING':
            return
        self.tournament.status = 'ONGOING'
        self.tournament.save()

    async def start_next_match(self):
        # Use a lock to ensure this method is not triggered more than once simultaneously
        lock_key = f"start_next_match_{self.tournament.tournamentID}"
        if not await self.add_lock(lock_key):
            return None

        try:
            current_time = time.time()
            if current_time - self.last_start_next_match < 10:
                return None

            self.last_start_next_match = current_time
            next_match = await self.get_next_unstarted_match()
            if not next_match:
                end_result = await self.end_tournament()

                if 'winner' in end_result:
                    matches = await self.get_matches()
                    await self.channel_layer.group_send(
                        f"tournament_{self.tournament.tournamentID}",
                        {
                            "type": "tournament.end",
                            "tournamentID": end_result['tournamentID'],
                            "winner": end_result['winner'],
                            "matches": matches
                        }
                    )
                return end_result

            if not all(next_match['players']):
                return None

            # Set startedAt to now if it's null
            await self.set_match_start_time(next_match['matchID'])

            matches = await self.get_matches()
            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {
                    "type": "match.begin",
                    "matchID": next_match['matchID'],
                    "players": next_match['players'],
                    "matches": matches
                }
            )

            # Warn players of the next match
            for player in next_match['players']:
                await self.notify_upcoming_match(player['userID'], True)

            # Get the next next match
            next_next_match = await self.get_next_unstarted_match()
            if next_next_match:
                for player in next_next_match['players']:
                    await self.notify_upcoming_match(player['userID'], False)

            return next_match
        finally:
            await self.delete_lock(lock_key)

    async def notify_upcoming_match(self, userID, imminent):
        channel_layer = get_channel_layer()
        group_name = f"chat_{userID}"

        message = "Your match is starting soon!" if imminent else "Your match is coming up next. Please be ready!"

        try:
            await channel_layer.group_send(
                group_name,
                {
                    "type": "upcoming_match",
                    "message": {
                        "content": message,
                    }
                }
            )
        except Exception as e:
            logger.error(f"Failed to send upcoming match notification. User: {userID}, Error: {str(e)}")

    @sync_to_async
    def set_match_start_time(self, match_id):
        Match.objects.filter(matchID=match_id, startedAt__isnull=True).update(startedAt=timezone.now())

    @sync_to_async
    def get_next_unstarted_match(self):
        next_match = Match.objects.filter(
            tournament=self.tournament,
            startedAt__isnull=True,
            flags=4
        ).order_by('createdAt').first()

        if next_match:
            players = next_match.whitelist.all()
            if players.count() == 2:  # Ensure there are exactly two players
                return {
                    'matchID': next_match.matchID,
                    'players': [get_safe_profile(UserSerializer(player).data, me=False) for player in players]
                }

        return None

    async def update_match_winner(self, match_id, winner_id):
        await sync_to_async(Match.objects.filter(matchID=match_id).update)(winnerID=winner_id)
        await self.update_last_match(winner_id)

    @sync_to_async
    def update_last_match(self, winner_id):
        last_match = Match.objects.filter(
            tournament=self.tournament,
            startedAt__isnull=True,
            flags=4
        ).filter(
            Q(playerA__isnull=True) | Q(playerB__isnull=True)
        ).order_by('-createdAt').first()

        if last_match:
            winner = User.objects.get(userID=winner_id)
            last_match.whitelist.add(winner)
            if last_match.playerA is None and (last_match.playerB is None or last_match.playerB['id'] != winner.userID):
                last_match.playerA = {"id": winner.userID, "platform": "web"}
            elif last_match.playerB is None and (last_match.playerA is None or last_match.playerA['id'] != winner.userID):
                last_match.playerB = {"id": winner.userID, "platform": "web"}
            last_match.save()

    @sync_to_async
    def end_tournament(self):
        self.tournament.status = 'COMPLETED'
        self.tournament.endDate = timezone.now()
        self.tournament.save()
        final_match = Match.objects.filter(tournament=self.tournament).order_by('-startedAt').first()
        if final_match and final_match.winnerID:
            winner = User.objects.get(userID=final_match.winnerID)
            self.tournament.winnerID = winner.userID
            self.tournament.save()
            return {
                "tournamentID": self.tournament.tournamentID,
                "winner": get_safe_profile(UserSerializer(winner).data, me=False)
            }
        else:
            return {
                "tournamentID": self.tournament.tournamentID,
                "winner": None
            }

    @sync_to_async
    def get_tournament_data(self):
        return {
            "tournamentID": self.tournament.tournamentID,
            "name": self.tournament.name,
            "status": self.tournament.status,
            "isPublic": self.tournament.isPublic,
            "participants": [get_safe_profile(UserSerializer(p).data, me=False) for p in self.tournament.participants.all()]
        }

    @sync_to_async
    def add_participant(self, user):
        self.tournament.participants.add(user)

    @sync_to_async
    def remove_participant(self, user):
        self.tournament.participants.remove(user)

    @sync_to_async
    def is_participant(self, user):
        return self.tournament.participants.filter(id=user.id).exists()

class TournamentConsumer(AsyncJsonWebsocketConsumer):
    HEARTBEAT_INTERVAL = 3
    MAX_MISSED_HEARTBEATS = 2

    async def connect(self):
        await self.accept()
        await self.send_json({"e": "HELLO", "d": {"heartbeat_interval": self.HEARTBEAT_INTERVAL * 1000}})
        self.user = None
        self.missed_heartbeats = 0
        self.heartbeat_task = asyncio.create_task(self.check_heartbeat())
        self.tournament = None
        self.tournament_manager = None

    async def disconnect(self, close_code):
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        if self.user and self.tournament:
            await self.channel_layer.group_discard(f"tournament_{self.tournament.tournamentID}", self.channel_name)
            await self.send_tournament_leave()

    async def receive_json(self, content):
        event_type = content.get('e')
        data = content.get('d')

        event_handlers = {
            'HEARTBEAT': self.handle_heartbeat,
            'IDENTIFY': self.handle_identify,
            'REGISTER_TOURNAMENT': self.handle_register_tournament
        }

        handler = event_handlers.get(event_type)
        if handler:
            await handler(data)
        else:
            logger.warning(f"Unhandled event type: {event_type}")

    async def handle_heartbeat(self, data):
        self.missed_heartbeats = 0
        await self.send_json({"e": "HEARTBEAT_ACK"})

    async def handle_identify(self, data):
        token = data.get('token')
        if not token:
            await self.close()
            return

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if not user_id:
                await self.close()
                return

            self.user = await self.get_user(user_id)
            if not self.user:
                await self.close()
                return

            try:
                await self.send_json({"e": "READY", "d": get_safe_profile(UserSerializer(self.user).data, me=False)})
            except Exception as _:
                pass

            current_tournament = await self.get_user_current_tournament(self.user)
            if current_tournament:
                await self.join_existing_tournament(current_tournament)

        except jwt.ExpiredSignatureError:
            await self.close()
        except jwt.InvalidTokenError:
            await self.close()

    async def handle_register_tournament(self, data):
        if not self.user:
            await self.close()
            return

        tournament_id = data.get('tournamentID')
        if not tournament_id:
            await self.send_error("No tournamentID provided")
            return

        try:
            self.tournament_manager = await TournamentManager.get_tournament(tournament_id)
        except Tournament.DoesNotExist:
            await self.send_error("Tournament not found")
            return

        if self.tournament_manager.tournament.status != 'PENDING':
            await self.send_error("Tournament is not in PENDING status")
            return

        if not self.tournament_manager.tournament.isPublic and not await self.tournament_manager.is_participant(self.user):
            await self.send_error("You are not allowed to join this private tournament")
            return

        await self.join_tournament(self.tournament_manager.tournament)

    async def join_existing_tournament(self, tournament):
        self.tournament = tournament
        self.tournament_manager = await TournamentManager.get_tournament(tournament.tournamentID)

        await self.channel_layer.group_add(f"tournament_{tournament.tournamentID}", self.channel_name)
        await self.channel_layer.group_send(
            f"tournament_{tournament.tournamentID}",
            {"type": "tournament.join", "user": get_safe_profile(UserSerializer(self.user).data, me=False)}
        )

        tournament_data = await self.tournament_manager.get_tournament_data()

        try:
            await self.send_json({"e": "CURRENT_TOURNAMENT", "d": tournament_data})
        except Exception as _:
            pass

    async def join_tournament(self, tournament):
        await self.tournament_manager.add_participant(self.user)
        await self.channel_layer.group_add(f"tournament_{tournament.tournamentID}", self.channel_name)

        self.tournament = tournament
        tournament_data = await self.tournament_manager.get_tournament_data()

        try:
            await self.send_json({"e": "TOURNAMENT_REGISTERED", "d": tournament_data})
        except Exception as _:
            pass

        safe_profile = get_safe_profile(UserSerializer(self.user).data, me=False)
        await self.channel_layer.group_send(
            f"tournament_{tournament.tournamentID}",
            {"type": "tournament.join", "user": safe_profile}
        )

    @sync_to_async
    def get_user(self, user_id):
        return User.objects.filter(id=user_id).first()

    @sync_to_async
    def get_user_current_tournament(self, user):
        return Tournament.objects.filter(participants=user, status__in=['PENDING', 'ONGOING']).first()

    async def check_heartbeat(self):
        while True:
            await asyncio.sleep(self.HEARTBEAT_INTERVAL)
            self.missed_heartbeats += 1
            if self.missed_heartbeats > self.MAX_MISSED_HEARTBEATS:
                logger.warning(f"[{self.__class__.__name__}] User missed 3 heartbeats, closing connection")
                await self.send_tournament_leave()
                await self.close()
                break

    async def tournament_match_join(self, event):
        match_id = event['match_id']
        players = event['players']
        try:
            await self.send_json({
                "e": "TOURNAMENT_MATCH_BEGIN",
                "d": {
                    "matchID": match_id,
                    "players": players
                }
            })
        except Exception as _:
            pass

    async def tournament_join(self, event):
        try:
            await self.send_json({"e": "TOURNAMENT_JOIN", "d": {"user": event["user"]}})
        except Exception as _:
            pass

    async def send_tournament_leave(self):
        if self.user and self.tournament:
            safe_profile = get_safe_profile(UserSerializer(self.user).data, me=False)
            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {"type": "tournament.leave", "user": safe_profile}
            )

    async def tournament_leave(self, event):
        try:
            await self.send_json({"e": "TOURNAMENT_LEAVE", "d": {"user": event["user"]}})
        except Exception as _:
            pass

    async def s_tournament_ready(self, event):
        try:
            await self.send_json({
                "e": "TOURNAMENT_READY",
                "d": {
                    "tournament": event['tournament_data'],
                    "matches": event['matches']
                }
            })
        except Exception as _:
            pass

    async def tournament_kick(self, event):
        kicked_user = event['user']
        if kicked_user['userID'] == self.user.userID:
            try:
                await self.send_json({"e": "TOURNAMENT_KICK", "d": {"message": "You have been kicked from the tournament"}})
                await self.close()
            except Exception as _:
                pass
        else:
            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {"type": "tournament.leave", "user": kicked_user}
            )

    async def tournament_ready(self, event):
        await self.tournament_manager.setup_tournament()

    async def match_begin(self, event):
        try:
            await self.send_json({
                "e": "TOURNAMENT_MATCH_BEGIN",
                "d": {
                    "matchID": event["matchID"],
                    "players": event["players"],
                    "matches": event["matches"]
                }
            })
        except Exception as _:
            pass

    async def tournament_round_end(self, event):
        match_id = event['matchID']
        winner_id = event['winner']
        await self.tournament_manager.update_match_winner(match_id, winner_id)
        await self.tournament_manager.start_next_match()

    async def tournament_end(self, event):
        try:
            await self.send_json({
                "e": "TOURNAMENT_END",
                "d": {
                    "tournamentID": event["tournamentID"],
                    "winner": event["winner"],
                    "matches": event["matches"]
                }
            })
        except Exception as _:
            pass

    async def send_error(self, message):
        try:
            await self.send_json({"e": "ERROR", "d": {"message": message}})
        except Exception as _:
            pass
