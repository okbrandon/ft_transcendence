import asyncio
import jwt
import logging
import time

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from django.db import transaction
from django.db.models import Q

from ..models import User, Tournament, Match
from ..util import get_safe_profile, generate_id
from ..serializers import UserSerializer, MatchSerializer

from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

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

        logger.info(f"Creating matches for tournament {self.tournament.tournamentID}")
        logger.info(f"Number of participants: {num_participants}")
        logger.info(f"Number of rounds: {num_rounds}")
        logger.info(f"Total matches: {total_matches}")

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

            logger.info(f"Creating match {match['matchID']} with players: {player1}, {player2}")

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

        logger.info(f"Created {len(matches)} matches for tournament {self.tournament.tournamentID}")

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
    def save_matches(self):
        for match in self.matches:
            match_obj = Match.objects.create(
                matchID=match['matchID'],
                tournament=self.tournament,
                flags=4
            )
            players = [User.objects.get(userID=player['userID']) for player in match['players'] if player]
            match_obj.whitelist.add(*players)
            match_obj.save()

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
        logger.warning(f"Timeout waiting for tournament {self.tournament.tournamentID} setup")
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
            logger.info(f"[{self.__class__.__name__}] start_next_match already in progress for tournament {self.tournament.tournamentID}")
            return None

        try:
            current_time = time.time()
            if current_time - self.last_start_next_match < 10:
                logger.info(f"[{self.__class__.__name__}] Skipping start_next_match, called too soon")
                return None

            self.last_start_next_match = current_time
            logger.info(f"[{self.__class__.__name__}] Starting next match for tournament {self.tournament.tournamentID}")

            next_match = await self.get_next_unstarted_match()
            if not next_match:
                logger.info(f"[{self.__class__.__name__}] No more matches to play. Ending tournament {self.tournament.tournamentID}")
                return await self.end_tournament()

            if not all(next_match['players']):
                logger.info(f"[{self.__class__.__name__}] Next match {next_match['matchID']} is not ready to start")
                return None

            logger.info(f"[{self.__class__.__name__}] Starting match: {next_match}")

            # Set startedAt to now if it's null
            await self.set_match_start_time(next_match['matchID'])

            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {
                    "type": "match.begin",
                    "matchID": next_match['matchID'],
                    "players": next_match['players']
                }
            )

            return next_match
        finally:
            await self.delete_lock(lock_key)

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
            if last_match.playerA is None:
                last_match.playerA = {"id": winner.userID, "platform": "web"}
            else:
                last_match.playerB = {"id": winner.userID, "platform": "web"}
            last_match.save()

    @sync_to_async
    def get_unfinished_matches(self):
        return list(Match.objects.filter(tournament=self.tournament, winnerID__isnull=True))

    @sync_to_async
    def get_match_winners(self):
        finished_matches = Match.objects.filter(tournament=self.tournament, winnerID__isnull=False)
        return [User.objects.get(userID=match.winnerID) for match in finished_matches]

    @sync_to_async
    def create_next_match(self, winners):
        if len(winners) < 2:
            return None

        match = {
            "matchID": generate_id("match"),
            "players": [
                get_safe_profile(UserSerializer(winners[0]).data, me=False),
                get_safe_profile(UserSerializer(winners[1]).data, me=False)
            ]
        }
        match_obj = Match.objects.create(
            matchID=match['matchID'],
            tournament=self.tournament,
            flags=4
        )
        match_obj.whitelist.add(winners[0], winners[1])
        match_obj.save()
        return match

    @sync_to_async
    def get_match_players(self, match):
        return [get_safe_profile(UserSerializer(player).data, me=False) for player in match.whitelist.all()]

    @sync_to_async
    def end_tournament(self):
        self.tournament.status = 'COMPLETED'
        self.tournament.endDate = timezone.now()
        self.tournament.save()
        final_match = Match.objects.filter(tournament=self.tournament).order_by('-startedAt').first()
        if final_match and final_match.winnerID:
            logger.info(f"final match: {final_match.matchID}")
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
        logger.info("New connection attempt")
        await self.accept()
        await self.send_json({"e": "HELLO", "d": {"heartbeat_interval": self.HEARTBEAT_INTERVAL * 1000}})
        self.user = None
        self.missed_heartbeats = 0
        self.heartbeat_task = asyncio.create_task(self.check_heartbeat())
        self.tournament = None
        self.tournament_manager = None
        logger.info("Connection established")

    async def disconnect(self, close_code):
        logger.info(f"Disconnecting with close code: {close_code}")
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        if self.user and self.tournament:
            await self.channel_layer.group_discard(f"tournament_{self.tournament.tournamentID}", self.channel_name)
            await self.send_tournament_leave()
        logger.info("Disconnected")

    async def receive_json(self, content):
        event_type = content.get('e')
        data = content.get('d')
        logger.debug(f"Received event: {event_type}")

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
            logger.warning("No token provided")
            await self.close()
            return

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if not user_id:
                logger.warning("Token payload does not contain user_id")
                await self.close()
                return

            self.user = await self.get_user(user_id)
            if not self.user:
                logger.warning(f"User {user_id} not found")
                await self.close()
                return

            await self.send_json({"e": "READY", "d": get_safe_profile(UserSerializer(self.user).data, me=False)})
            logger.info(f"User {user_id} identified successfully")

            current_tournament = await self.get_user_current_tournament(self.user)
            if current_tournament:
                await self.join_existing_tournament(current_tournament)

        except jwt.ExpiredSignatureError:
            logger.warning("Expired token")
            await self.close()
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            await self.close()

    async def handle_register_tournament(self, data):
        if not self.user:
            logger.warning("Attempt to register for tournament without identification")
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
        await self.send_json({"e": "CURRENT_TOURNAMENT", "d": tournament_data})
        logger.info(f"User {self.user.userID} is part of tournament {tournament.tournamentID}")

    async def join_tournament(self, tournament):
        await self.tournament_manager.add_participant(self.user)
        await self.channel_layer.group_add(f"tournament_{tournament.tournamentID}", self.channel_name)
        self.tournament = tournament
        tournament_data = await self.tournament_manager.get_tournament_data()
        await self.send_json({"e": "TOURNAMENT_REGISTERED", "d": tournament_data})
        logger.info(f"User {self.user.userID} registered for tournament {tournament.tournamentID}")

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
            logger.debug(f"Missed heartbeats: {self.missed_heartbeats}")
            if self.missed_heartbeats > self.MAX_MISSED_HEARTBEATS:
                logger.warning("Max missed heartbeats exceeded, closing connection")
                await self.send_tournament_leave()
                await self.close()
                break

    async def tournament_match_join(self, event):
        match_id = event['match_id']
        players = event['players']
        await self.send_json({
            "e": "TOURNAMENT_MATCH_BEGIN",
            "d": {
                "matchID": match_id,
                "players": players
            }
        })
        logger.info(f"Tournament match {match_id} is ready to begin for user {self.user.userID} with players: {players}")

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
            logger.info(f"User {self.user.userID} left tournament {self.tournament.tournamentID}")

    async def tournament_leave(self, event):
        await self.send_json({"e": "TOURNAMENT_LEAVE", "d": {"user": event["user"]}})

    async def s_tournament_ready(self, event):
        await self.send_json({
            "e": "TOURNAMENT_READY",
            "d": {
                "tournament": event['tournament_data'],
                "matches": event['matches']
            }
        })

    async def tournament_kick(self, event):
        kicked_user = event['user']
        if kicked_user['userID'] == self.user.userID:
            await self.send_json({"e": "TOURNAMENT_KICK", "d": {"message": "You have been kicked from the tournament"}})
            await self.close()
        else:
            await self.channel_layer.group_send(
                f"tournament_{self.tournament.tournamentID}",
                {"type": "tournament.leave", "user": kicked_user}
            )
        logger.info(f"User {kicked_user['userID']} was kicked from tournament {self.tournament.tournamentID}")

    async def tournament_ready(self, event):
        logger.info(f"Tournament ready event received for tournament {self.tournament.tournamentID}")
        tournament_data = event['tournament']
        await self.tournament_manager.setup_tournament()

    async def start_next_match(self):
        # Use a lock to ensure this method is not triggered more than once simultaneously
        lock_key = f"start_next_match_{self.tournament.tournamentID}"
        if not await self.tournament_manager.add_lock(lock_key):
            logger.info(f"start_next_match already in progress for tournament {self.tournament.tournamentID}")
            return

        try:
            current_match = await self.tournament_manager.start_next_match()
            if current_match:
                if 'winner' in current_match:
                    matches = await self.tournament_manager.get_matches()
                    await self.channel_layer.group_send(
                        f"tournament_{self.tournament.tournamentID}",
                        {
                            "type": "tournament.end",
                            "tournamentID": current_match['tournamentID'],
                            "winner": current_match['winner'],
                            "matches": matches
                        }
                    )
                else:
                    await self.channel_layer.group_send(
                        f"tournament_{self.tournament.tournamentID}",
                        {
                            "type": "match.begin",
                            "matchID": current_match['matchID'],
                            "players": current_match['players']
                        }
                    )
        finally:
            await self.tournament_manager.delete_lock(lock_key)

    async def match_begin(self, event):
        await self.send_json({
            "e": "TOURNAMENT_MATCH_BEGIN",
            "d": {
                "matchID": event["matchID"],
                "players": event["players"]
            }
        })
        logger.info(f"Match begin event sent for match: {event['matchID']}")

    async def tournament_round_end(self, event):
        logger.info(f"Tournament round end event received for tournament {self.tournament.tournamentID}")
        match_id = event['matchID']
        winner_id = event['winner']
        logger.info(f"Match {match_id} ended. Winner: {winner_id}")
        await self.tournament_manager.update_match_winner(match_id, winner_id)
        await self.tournament_manager.start_next_match()

    async def tournament_end(self, event):
        tournament_data = await self.tournament_manager.get_tournament_data()
        await self.send_json({
            "e": "TOURNAMENT_END",
            "d": {
                "tournamentID": event["tournamentID"],
                "winner": event["winner"],
                "matches": event["matches"]
            }
        })

    async def send_error(self, message):
        await self.send_json({"e": "ERROR", "d": {"message": message}})
