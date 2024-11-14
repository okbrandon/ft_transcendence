import logging
import asyncio
import random
import os
import time
import jwt
import httpx
import threading

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from concurrent.futures import ThreadPoolExecutor
from asgiref.sync import sync_to_async, async_to_sync

from django.utils import timezone
from django.core.cache import cache

from ..models import User, Match, UserSettings, Tournament
from ..util import generate_id, get_safe_profile, get_user_id_from_token
from ..serializers import UserSerializer, UserSettingsSerializer, MatchSerializer

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class MatchConsumer(AsyncJsonWebsocketConsumer):
    active_matches = {}

    async def connect(self):
        logger.info(f"[{self.__class__.__name__}] New connection attempt")
        await self.accept()
        await self.send_json({
            "e": "HELLO",
            "d": {"heartbeat_interval": 1000}
        })
        self.last_paddle_move = time.time()
        self.last_heartbeat = time.time()
        self.heartbeat_task = asyncio.create_task(self.heartbeat_check())
        self.match = None
        self.is_spectator = False
        logger.info(f"[{self.__class__.__name__}] Connection accepted, heartbeat check task started")

    async def disconnect(self, close_code):
        logger.info(f"[{self.__class__.__name__}] Disconnecting with close code: {close_code}")
        if hasattr(self, 'heartbeat_task'):
            self.heartbeat_task.cancel()

        if self.match:
            if not self.is_spectator:
                await self.handle_player_quit()
            else:
                await self.leave_spectator_mode()

        logger.info(f"[{self.__class__.__name__}] Disconnected, cleanup completed")

    async def receive_json(self, content):
        event_type = content.get('e')
        data = content.get('d')

        if event_type != 'HEARTBEAT':
            pass

        if event_type == 'HEARTBEAT':
            self.last_heartbeat = time.time()
            try:
                await self.send_json({"e": "HEARTBEAT_ACK"})
            except Exception as _:
                pass
        elif event_type == 'IDENTIFY':
            await self.handle_identify(data)
        elif event_type == 'MATCHMAKE_REQUEST':
            await self.handle_matchmake_request(data)
        elif event_type == 'MATCHMAKE_FORCE_JOIN':
            await self.handle_matchmake_force_join(data)
        elif event_type == 'PADDLE_MOVE':
            await self.handle_paddle_move(data)
        elif event_type == 'PLAYER_QUIT':
            await self.handle_player_quit()
        elif event_type == 'SPECTATE_REQUEST':
            await self.handle_spectate_request(data)
        elif event_type == 'TOURNAMENT_MATCH_JOIN':
            await self.handle_tournament_match_join(data)

    async def heartbeat_check(self):
        while True:
            await asyncio.sleep(2)  # Check every 2 seconds
            current_time = time.time()
            if current_time - self.last_heartbeat > 10:  # No heartbeat for 10 seconds
                logger.warning(f"[{self.__class__.__name__}] User {self.user.userID} missed heartbeat too many times, closing connection")
                await self.close()
                break

    async def handle_identify(self, data):
        token = data.get('token')

        if token != os.getenv('BOT_TOKEN'):
            try:
                user_id = await get_user_id_from_token(token)

                if user_id is None:
                    logger.info(f"[{self.__class__.__name__}] Connection attempt with invalid token")
                    await self.close()
                    return

                self.user = await sync_to_async(User.objects.get)(userID=user_id)
                if not self.user:
                    logger.warning(f"User {user_id} not found")
                    await self.close()
                    return

                user_data = UserSerializer(self.user).data
                safe_profile = get_safe_profile(user_data, me=True)
                try:
                    await self.send_json({"e": "READY", "d": safe_profile})
                except Exception as e:
                    logger.error(f"[{self.__class__.__name__}] Failed to send READY event: {str(e)}")
                    await self.close()
                logger.info(f"[{self.__class__.__name__}] User identified: {self.user.userID}")
            except jwt.ExpiredSignatureError:
                logger.warning("Expired token")
                await self.close()
            except jwt.InvalidTokenError:
                logger.warning("Invalid token")
                await self.close()
        else:
            self.user = await self.get_user_from_id('user_ai')
            user_data = UserSerializer(self.user).data
            safe_profile = get_safe_profile(user_data, me=True)
            safe_profile.pop('avatarID', None)
            try:
                await self.send_json({"e": "READY", "d": safe_profile})
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to send READY event: {str(e)}")
                await self.close()
            logger.info(f"[{self.__class__.__name__}] AI identified: {self.user.userID}")

    async def get_user_profile(self, token):
        try:
            user_id = await get_user_id_from_token(token)
            if user_id:
                try:
                    user = await sync_to_async(User.objects.get)(userID=user_id)
                    user_data = UserSerializer(user).data
                    safe_profile = await sync_to_async(get_safe_profile)(user_data, me=True)
                    logger.info(f"[{self.__class__.__name__}] User profile retrieved successfully")
                    return safe_profile
                except User.DoesNotExist:
                    logger.error(f"[{self.__class__.__name__}] User not found for ID: {user_id}")
            else:
                logger.error(f"[{self.__class__.__name__}] Failed to retrieve user ID from token")
        except Exception as e:
            logger.error(f"[{self.__class__.__name__}] Exception occurred while getting user ID from token: {str(e)}")
        return None

    async def handle_matchmake_request(self, data):
        match_type = data.get('match_type')
        match = await self.find_or_create_match(match_type)

        logger.info(f"[{self.__class__.__name__}] Matchmaking request received for type: {match_type}")
        if not match:
            return

        self.match = match
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        # Initialize match state for this match
        if match.matchID not in self.active_matches:
            self.active_matches[match.matchID] = {
                'playerA': {'id': match.playerA['id'], 'paddle_y': 375, 'pos': 'A'},
                'playerB': {'id': match.playerB['id'] if match.playerB else None, 'paddle_y': 375, 'pos': 'B'},
                'ball': {},
                'scores': {match.playerA['id']: 0},
                'rewards': {match.playerA['id']: {'xp': 0, 'money': 0}},
                'startedAt': None,
            }
            self.reset_ball(self.active_matches[match.matchID])
            logger.info(f"[{self.__class__.__name__}] New match state initialized for match: {match.matchID}")

        try:
            await self.send_json({
                "e": "MATCH_JOIN",
                "d": {
                    "match_id": match.matchID,
                    "side": "left" if match.playerA['id'] == self.user.userID else "right",
                    "opponent": await self.get_opponent_info(match, self.user)
                }
            })
        except Exception as e:
            logger.error(f"[{self.__class__.__name__}] Failed to send MATCH_JOIN event: {str(e)}")
            await self.close()

        if match.playerB:
            self.active_matches[match.matchID]['playerB']['id'] = match.playerB['id']
            self.active_matches[match.matchID]['scores'][match.playerB['id']] = 0
            self.active_matches[match.matchID]['rewards'][match.playerB['id']] = {'xp': 0, 'money': 0}

            playerB_info = await self.get_opponent_info(match, await self.get_user_from_id(match.playerA['id']))
            await self.channel_layer.group_send(
                f"match_{match.matchID}",
                {
                    "type": "player.join",
                    "player": playerB_info,
                    "side": "playerB"
                }
            )
            await self.send_match_ready(match)
            logger.info(f"[{self.__class__.__name__}] Match {match.matchID} started with both players")

    async def handle_tournament_match_join(self, data):
        match_id = data.get('match_id')
        logger.info(f"[{self.__class__.__name__}] Tournament match join request received for match: {match_id}")
        logger.debug(f"[{self.__class__.__name__}] Full data received: {data}")

        match = await self.find_match_by_id(match_id)
        logger.debug(f"[{self.__class__.__name__}] Match found: {match}")
        if not match:
            await self.send_tournament_match_join_failed("Invalid tournament match")
            return

        tournament = await database_sync_to_async(lambda: match.tournament)()
        logger.debug(f"[{self.__class__.__name__}] Tournament associated with match: {tournament}")
        if not tournament:
            await self.send_tournament_match_join_failed("Match is not part of a tournament")
            return

        is_user_in_tournament = await self.is_user_in_tournament(self.user.userID, tournament.tournamentID)
        logger.debug(f"[{self.__class__.__name__}] Is user in tournament: {is_user_in_tournament}")
        if not is_user_in_tournament:
            await self.send_tournament_match_join_failed("User not in tournament")
            return

        self.match = match
        logger.debug(f"[{self.__class__.__name__}] Set self.match to: {self.match}")
        await self.channel_layer.group_add(f"match_{match.matchID}", self.channel_name)
        logger.debug(f"[{self.__class__.__name__}] Added to channel group: match_{match.matchID}")

        is_whitelisted = await self.is_user_whitelisted(self.user, match)
        logger.debug(f"[{self.__class__.__name__}] Is user whitelisted: {is_whitelisted}")

        cache_key = f"player_join_handling_{match_id}"

        sleep_time = random.uniform(0.5, 2)
        logger.info(f"[{self.__class__.__name__}] [LOCK] Waiting ({sleep_time}s) before match lock {match_id}, player is {self.user.username}")
        await asyncio.sleep(sleep_time)

        start_time = time.time()
        while await sync_to_async(cache.get)(cache_key):
            await asyncio.sleep(1)
            elapsed = time.time() - start_time
            if elapsed > 10:
                await self.send_tournament_match_join_failed("Join timeout, abnormally long wait")
                return
            logger.info(f"[{self.__class__.__name__}] [LOCK] Waiting for match lock {match_id}, player is {self.user.username}")

        await sync_to_async(cache.set)(cache_key, True, timeout=15)
        logger.info(f"[{self.__class__.__name__}] [LOCK] Locking match {match_id}, player is {self.user.username}")

        try:
            if is_whitelisted:
                logger.debug(f"[{self.__class__.__name__}] User is whitelisted, proceeding with match join")
                asyncio.create_task(self.join_match_as_player(match))
            else:
                logger.debug(f"[{self.__class__.__name__}] User is not whitelisted, joining as spectator")
                self.is_spectator = True
                await self.handle_spectate_request({"match_id": match_id})

            logger.debug(f"[{self.__class__.__name__}] handle_tournament_match_join completed for match {match_id}")
        finally:
            logger.info(f"[{self.__class__.__name__}] [LOCK] Handling done {match_id}, player is {self.user.username}")
            await asyncio.sleep(1)
            await sync_to_async(cache.delete)(cache_key)
            logger.info(f"[{self.__class__.__name__}] [LOCK] Removing cache key {match_id}, player is {self.user.username}")

    async def join_match_as_player(self, match):
        side = "left" if match.playerA['id'] == self.user.userID else "right"
        await self.update_match_state(match)
        await self.send_match_join(match, side)

        match_state = self.active_matches[match.matchID]
        logger.info(f"[{self.__class__.__name__}] Match state: {match_state}")

        if match_state['playerA']['connected'] and match_state['playerB']['connected']:
            current_time = time.time()
            match_ready_cache_key = f"match_ready_{match.matchID}"
            last_sent = await sync_to_async(cache.get)(match_ready_cache_key, 0)

            if current_time - last_sent >= 12:
                self.active_matches[match.matchID]['playerA']['connected'] = False
                self.active_matches[match.matchID]['playerB']['connected'] = False

                join_handling_cache_key = f"player_join_handling_{match.matchID}"
                start_time = time.time()
                while await sync_to_async(cache.get)(join_handling_cache_key):
                    await asyncio.sleep(1)
                    elapsed = time.time() - start_time
                    if elapsed > 10:
                        await self.send_tournament_match_join_failed("Join timeout, abnormally long wait")
                        return
                    logger.info(f"[{self.__class__.__name__}] [LOCK - INSIDE FUNC] Waiting for match lock {match.matchID}, player is {self.user.username}")

                await sync_to_async(cache.set)(match_ready_cache_key, current_time, timeout=30)
                await self.send_match_ready(match)
                logger.info(f"[{self.__class__.__name__}] Tournament match {match.matchID} started with both players")
            else:
                logger.debug(f"[{self.__class__.__name__}] Skipped sending match ready for {match.matchID} due to rate limiting")

    async def update_match_state(self, match):
        if match.matchID not in self.active_matches:
            logger.debug(f"[{self.__class__.__name__}] Initializing new match state for {match.matchID}")
            self.active_matches[match.matchID] = {
                'playerA': {'id': match.playerA['id'], 'paddle_y': 375, 'pos': 'A', 'connected': False},
                'playerB': {'id': match.playerB['id'], 'paddle_y': 375, 'pos': 'B', 'connected': False},
                'ball': {},
                'scores': {match.playerA['id']: 0, match.playerB['id']: 0},
                'spectators': [],
                'rewards': {
                    match.playerA['id']: {'xp': 0, 'money': 0},
                    match.playerB['id']: {'xp': 0, 'money': 0}
                },
                'startedAt': None,
            }
            self.reset_ball(self.active_matches[match.matchID])
            logger.debug(f"[{self.__class__.__name__}] Reset ball for new match")

        if match.playerA['id'] == self.user.userID:
            self.active_matches[match.matchID]['playerA']['connected'] = True
            logger.debug(f"[{self.__class__.__name__}] Player A connected for match {match.matchID}")
        elif match.playerB['id'] == self.user.userID:
            self.active_matches[match.matchID]['playerB']['connected'] = True
            logger.debug(f"[{self.__class__.__name__}] Player B connected for match {match.matchID}")

    async def send_match_join(self, match, side):
        await self.send_json({
            "e": "MATCH_JOIN",
            "d": {
                "match_id": match.matchID,
                "side": side,
                "opponent": await self.get_opponent_info(match, self.user)
            }
        })
        logger.debug(f"[{self.__class__.__name__}] Sent MATCH_JOIN response")

    async def send_tournament_match_join_failed(self, reason):
        logger.error(f"[{self.__class__.__name__}] {reason}")
        await self.send_json({
            "e": "TOURNAMENT_MATCH_JOIN_FAILED",
            "d": {"reason": reason}
        })
        logger.debug(f"[{self.__class__.__name__}] Sent TOURNAMENT_MATCH_JOIN_FAILED response")

    @sync_to_async
    def get_user(self, user_id):
        return User.objects.filter(id=user_id).first()

    @database_sync_to_async
    def is_user_in_tournament(self, user_id, tournament_id):
        try:
            tournament = Tournament.objects.get(tournamentID=tournament_id)
            return tournament.participants.filter(userID=user_id).exists()
        except Tournament.DoesNotExist:
            return False

    @database_sync_to_async
    def is_user_whitelisted(self, user, match):
        return match.whitelist.filter(userID=user.userID).exists()

    async def handle_matchmake_force_join(self, data):
        if self.user.userID != 'user_ai':
            logger.error(f"[{self.__class__.__name__}] User {self.user.userID} attempted to force join a match")
            return

        match_id = data.get('match_id')
        logger.info(f"[{self.__class__.__name__}] User {self.user.userID} asked to force join match {match_id}")

        match = await self.find_match_by_id(match_id)

        if not match:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} not found")
            try:
                await self.send_json({
                    "e": "MATCH_FORCE_JOIN_FAILED",
                    "d": {
                        "reason": "Match not found"
                    }
                })
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to send MATCH_FORCE_JOIN_FAILED event: {str(e)}")
            return

        if match.flags != 2:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} is not an AI match")
            try:
                await self.send_json({
                    "e": "MATCH_FORCE_JOIN_FAILED",
                    "d": {
                        "reason": "Match is not an AI match"
                    }
                })
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to send MATCH_FORCE_JOIN_FAILED event: {str(e)}")
            return

        match.playerB = {"id": self.user.userID, "platform": "server"}
        sync_to_async(match.save)()

        self.match = match
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        try:
            await self.send_json({
                "e": "MATCH_JOIN",
                "d": {
                    "match_id": match.matchID,
                    "side": "left" if match.playerA['id'] == self.user.userID else "right",
                    "opponent": await self.get_opponent_info(match, self.user)
                }
            })
        except Exception as e:
            logger.error(f"[{self.__class__.__name__}] Failed to send MATCH_JOIN event: {str(e)}")
            await self.close()

        if match.playerB:
            self.active_matches[match.matchID]['playerB']['id'] = match.playerB['id']
            self.active_matches[match.matchID]['scores'][match.playerB['id']] = 0
            self.active_matches[match.matchID]['rewards'][match.playerB['id']] = {'xp': 0, 'money': 0}

            playerB_info = await self.get_opponent_info(match, await self.get_user_from_id(match.playerA['id']))
            await self.channel_layer.group_send(
                f"match_{match.matchID}",
                {
                    "type": "player.join",
                    "player": playerB_info,
                    "side": "playerB"
                }
            )
            await self.send_match_ready(match)
            logger.info(f"[{self.__class__.__name__}] Match {match.matchID} started with both players")

    @database_sync_to_async
    def update_match_started_at(self):
        self.match.startedAt = timezone.now()
        self.match.save()

    async def send_match_ready(self, match):
        await self.update_match_started_at()
        self.active_matches[match.matchID]['startedAt'] = str(self.match.startedAt)

        match_state = self.active_matches[match.matchID]
        await self.channel_layer.group_send(
            f"match_{match.matchID}",
            {
                "type": "match.ready",
                "match_state": match_state
            }
        )
        logger.info(f"[{self.__class__.__name__}] MATCH_READY sent for match: {match.matchID}")
        asyncio.create_task(self.delayed_match_start(match))

    async def delayed_match_start(self, match):
        await asyncio.sleep(5)
        if match.matchID in self.active_matches:
            await self.start_match(match)
        else:
            logger.info(f"[{self.__class__.__name__}] Match {match.matchID} was deleted before starting")

    async def match_ready(self, event):
        try:
            await self.send_json({
                "e": "MATCH_READY",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    async def handle_paddle_move(self, data):
        if self.is_spectator:
            return

        if self.match is None:
            logger.error(f"[{self.__class__.__name__}] Player {self.user.userID} attempted to move paddle without being in a match")
            return
        if self.match.matchID not in self.active_matches:
            logger.error(f"[{self.__class__.__name__}] Match state not found for match: {self.match.matchID}")
            return

        paddle_speed = 5 # Appropriate paddle speed (adjust as needed)
        direction = data.get('direction')
        match_state = self.active_matches[self.match.matchID]
        now = time.time()

        if now - self.last_paddle_move < 0.015: # 15ms minimum time between paddle moves
            logger.error(f"[{self.__class__.__name__}] Player {self.user.userID} moved paddle too quickly")
            try:
                await self.send_json({
                    "e": "PADDLE_RATE_LIMIT"
                })
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to send error event: {str(e)}")
            return

        player_key = 'playerA' if match_state['playerA']['id'] == self.user.userID else 'playerB'

        if direction == 'up':
            match_state[player_key]['paddle_y'] = min(682, match_state[player_key]['paddle_y'] + paddle_speed)
        elif direction == 'down':
            match_state[player_key]['paddle_y'] = max(73, match_state[player_key]['paddle_y'] - paddle_speed)

        self.last_paddle_move = time.time()
        await self.send_match_update()

    async def handle_player_quit(self):
        if self.match is None:
            logger.info(f"[{self.__class__.__name__}] Player {self.user.userID} quit without being in a match")
            return

        logger.info(f"[{self.__class__.__name__}] Player {self.user.userID} quit the match {self.match.matchID}")

        if self.match.playerB is not None and self.match.playerA is not None:
            winner_id = self.match.playerA['id'] if self.match.playerB['id'] == self.user.userID else self.match.playerB['id']
            await self.send_match_end(winner_id)

        if self.match.playerB is None or self.match.playerA is None:
            if self.match.finishedAt is None:
                await self.delete_match(self.match.matchID)

            if self.match.matchID in self.active_matches:
                logger.info(f"[{self.__class__.__name__}] Deleting match state for match: {self.match.matchID}")
                del self.active_matches[self.match.matchID]

    async def handle_spectate_request(self, data):
        match_id = data.get('match_id')
        match = await self.find_match_by_id(match_id)

        if not match:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} not found for spectating")
            await self.send_json({
                "e": "SPECTATE_FAILED",
                "d": {
                    "reason": "Match not found"
                }
            })
            return

        self.match = match
        self.is_spectator = True
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        await self.update_match_state(match)

        playerA = await self.get_user_from_id(match.playerA['id'])
        playerB = await self.get_user_from_id(match.playerB['id']) if match.playerB else None

        playerA_data = UserSerializer(playerA).data
        playerB_data = UserSerializer(playerB).data if playerB else None

        safe_playerA = get_safe_profile(playerA_data, me=False)
        safe_playerB = get_safe_profile(playerB_data, me=False) if playerB_data else None

        match_state = self.active_matches[match.matchID]
        match_state['spectators'].append(self.user.userID)
        playerA = await self.get_user_from_id(match.playerA['id'])
        playerB = await self.get_user_from_id(match.playerB['id']) if match.playerB else None

        playerA_data = UserSerializer(playerA).data
        playerB_data = UserSerializer(playerB).data if playerB else None

        safe_playerA = get_safe_profile(playerA_data, me=False)
        safe_playerB = get_safe_profile(playerB_data, me=False) if playerB_data else None

        await self.send_json({
            "e": "SPECTATE_JOIN",
            "d": {
                "match_id": match.matchID,
                "match_state": match_state,
                "playerA": safe_playerA,
                "playerB": safe_playerB
            }
        })

        self.match.playerA = match_state['playerA']
        self.match.playerB = match_state['playerB']

        logger.info(f"[{self.__class__.__name__}] User {self.user.userID} joined match {match_id} as spectator")

    async def leave_spectator_mode(self):
        if self.match and self.is_spectator:
            if self.match.matchID in self.active_matches:
                match_state = self.active_matches[self.match.matchID]
                match_state['spectators'].remove(self.user.userID)
            await self.channel_layer.group_discard(
                f"match_{self.match.matchID}",
                self.channel_name
            )
            logger.info(f"[{self.__class__.__name__}] User {self.user.userID} left spectator mode for match {self.match.matchID}")

    @database_sync_to_async
    def delete_match(self, match_id):
        try:
            match = Match.objects.get(matchID=match_id)
            match.delete()
            logger.info(f"[{self.__class__.__name__}] Deleted match {match_id} as playerB was None")
        except Match.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Failed to delete match {match_id}: Match not found")

    @database_sync_to_async
    def get_user_from_id(self, user_id):
        try:
            return User.objects.get(userID=user_id)
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] User not found: {user_id}")
            return None

    @database_sync_to_async
    def find_match_by_id(self, match_id):
        try:
            return Match.objects.get(matchID=match_id)
        except Match.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Match not found: {match_id}")
            return None

    @database_sync_to_async
    def find_or_create_match(self, match_type):
        if match_type == '1v1':
            available_match = Match.objects.filter(playerB__isnull=True, flags__exact=0).first()
            if available_match and available_match.playerA['id'] != self.user.userID:
                available_match.playerB = {"id": self.user.userID, "platform": "web"}
                available_match.save()
                logger.info(f"[{self.__class__.__name__}] Joined existing match: {available_match.matchID}")
                return available_match
            else:
                new_match = Match.objects.create(
                    matchID=generate_id("match"),
                    playerA={"id": self.user.userID, "platform": "web"},
                    winnerID=None,
                    scores={},
                    finishedAt=None,
                    flags=0
                )
                logger.info(f"[{self.__class__.__name__}] Created new match: {new_match.matchID}")
                return new_match
        elif match_type == 'ai':
            new_match = Match.objects.create(
                matchID=generate_id("match"),
                playerA={"id": self.user.userID, "platform": "web"},
                winnerID=None,
                finishedAt=None,
                scores={},
                flags=1 << 1  # AI flag
            )
            logger.info(f"[{self.__class__.__name__}] Created new AI match: {new_match.matchID}")
            try:
                httpx.post('https://pongbot:5443/bot/connect', json={'matchID': new_match.matchID}, verify=False)
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to connect to bot: {str(e)}")
            return new_match
        elif match_type == 'challenge':
            available_match = Match.objects.filter(finishedAt__isnull=True, whitelist__userID=self.user.userID, flags__exact=5).first()

            if available_match:
                logger.info(f"[{self.__class__.__name__}] Found existing challenge match: {MatchSerializer(available_match).data}")

                if available_match.playerA is None and available_match.playerB is None:
                    available_match.playerA = {"id": self.user.userID, "platform": "web"}
                if available_match.playerB is None and available_match.playerA['id'] != self.user.userID:
                    available_match.playerB = {"id": self.user.userID, "platform": "web"}
                available_match.save()

                return available_match
            else:
                return None

    @database_sync_to_async
    def get_opponent_info(self, match, user):
        if match.playerB is None:
            return None
        opponent_id = match.playerB['id'] if match.playerA['id'] == user.userID else match.playerA['id']
        try:
            opponent = User.objects.get(userID=opponent_id)
            opponent_data = UserSerializer(opponent).data
            safe_profile = get_safe_profile(opponent_data, me=False)
            opponent_settings, _ = UserSettings.objects.get_or_create(userID=opponent_id)
            opponent_settings_data = UserSettingsSerializer(opponent_settings).data
            safe_profile['paddle_skin'] = opponent_settings_data['selectedPaddleSkin']
            logger.info(f"[{self.__class__.__name__}] Opponent info retrieved for: {opponent_id}")
            return safe_profile
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Opponent not found: {opponent_id}")
            return None

    async def send_match_update(self):
        match_state = self.active_matches[self.match.matchID]
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "match.update",
                "match_state": match_state
            }
        )

    async def match_update(self, event):
        try:
            await self.send_json({
                "e": "MATCH_UPDATE",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    async def match_begin(self, event):
        try:
            await self.send_json({
                "e": "MATCH_BEGIN",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    @database_sync_to_async
    def start_match(self, match):
        match_state = self.active_matches[match.matchID]

        # Use async_to_sync to run the coroutine in a new event loop
        async_to_sync(self._start_match_async)(match.matchID, match_state)
        logger.info(f"[{self.__class__.__name__}] Match loop started for match: {match.matchID}")

    async def _start_match_async(self, match_id, match_state):
        await self.channel_layer.group_send(
            f"match_{match_id}",
            {
                "type": "match.begin",
                "match_state": match_state
            }
        )
        self._start_match_in_thread(match_id)

    def _start_match_in_thread(self, match_id):
        self.active_matches[match_id]['is_active'] = True
        loop = asyncio.get_event_loop()
        executor = ThreadPoolExecutor()
        executor.submit(self.run_match_loop_sync, match_id, loop)

    def stop_match(self, match_id):
        # Set the is_active flag to False to stop the loop
        if match_id in self.active_matches:
            self.active_matches[match_id]['is_active'] = False

    def run_match_loop_sync(self, match_id, loop):
        TERRAIN_WIDTH = 1200
        TERRAIN_HEIGHT = 750
        PADDLE_WIDTH = 10
        PADDLE_HEIGHT = 60
        BALL_RADIUS = 25 / 2
        BALL_SPEED = 0.6
        BALL_MAX_SPEED = 19
        REFRESH_RATE = 1 / 60

        FAST_MATCH = os.environ.get('FAST_MATCH', 'false').lower() == 'true'
        MAX_SCORE = 3 if FAST_MATCH else 10

        logger.info(f"[{self.__class__.__name__}] Starting match loop for match: {match_id}")
        logger.info(f"[{self.__class__.__name__}] FAST_MATCH: {FAST_MATCH}, MAX_SCORE: {MAX_SCORE}")

        while match_id in self.active_matches and self.active_matches[match_id].get('is_active', False):
            match_state = self.active_matches[match_id]

            # Update ball position
            match_state['ball']['x'] += match_state['ball']['dx'] * BALL_SPEED
            match_state['ball']['y'] += match_state['ball']['dy'] * BALL_SPEED

            # Check for collisions with top and bottom walls
            if match_state['ball']['y'] - BALL_RADIUS <= 0 or match_state['ball']['y'] + BALL_RADIUS >= TERRAIN_HEIGHT:
                match_state['ball']['dy'] *= -1
                asyncio.run_coroutine_threadsafe(self.send_ball_hit(match_state['ball']), loop)

            # Check for collisions with paddles
            if (match_state['ball']['x'] - BALL_RADIUS <= PADDLE_WIDTH and
                match_state['ball']['y'] - BALL_RADIUS <= match_state['playerA']['paddle_y'] + PADDLE_HEIGHT and
                match_state['ball']['y'] + BALL_RADIUS >= match_state['playerA']['paddle_y'] - PADDLE_HEIGHT):
                match_state['ball']['dx'] *= -1
                if abs(match_state['ball']['dx']) < BALL_MAX_SPEED:
                    match_state['ball']['dx'] *= 1.1
                if abs(match_state['ball']['dy']) < BALL_MAX_SPEED:
                    match_state['ball']['dy'] *= 1.1
                match_state['ball']['x'] = PADDLE_WIDTH + BALL_RADIUS
                asyncio.run_coroutine_threadsafe(self.send_paddle_hit(match_state['playerA'], match_state['ball']), loop)

            elif (match_state['ball']['x'] + BALL_RADIUS >= TERRAIN_WIDTH - PADDLE_WIDTH and
                match_state['ball']['y'] - BALL_RADIUS <= match_state['playerB']['paddle_y'] + PADDLE_HEIGHT and
                match_state['ball']['y'] + BALL_RADIUS >= match_state['playerB']['paddle_y'] - PADDLE_HEIGHT):
                match_state['ball']['dx'] *= -1
                if abs(match_state['ball']['dx']) < BALL_MAX_SPEED:
                    match_state['ball']['dx'] *= 1.1
                if abs(match_state['ball']['dy']) < BALL_MAX_SPEED:
                    match_state['ball']['dy'] *= 1.1
                match_state['ball']['x'] = TERRAIN_WIDTH - PADDLE_WIDTH - BALL_RADIUS
                asyncio.run_coroutine_threadsafe(self.send_paddle_hit(match_state['playerB'], match_state['ball']), loop)

            # Check for scoring
            if match_state['ball']['x'] <= 0:
                match_state['scores'][match_state['playerB']['id']] += 1
                match_state['rewards'][match_state['playerB']['id']]['xp'] += random.randint(3, 6)
                match_state['rewards'][match_state['playerB']['id']]['money'] += random.randint(1, 3)
                self.reset_ball(match_state)
                asyncio.run_coroutine_threadsafe(self.send_ball_scored(match_state['playerB']), loop)
            elif match_state['ball']['x'] + BALL_RADIUS >= TERRAIN_WIDTH:
                match_state['scores'][match_state['playerA']['id']] += 1
                match_state['rewards'][match_state['playerA']['id']]['xp'] += random.randint(3, 6)
                match_state['rewards'][match_state['playerA']['id']]['money'] += random.randint(1, 3)
                self.reset_ball(match_state)
                asyncio.run_coroutine_threadsafe(self.send_ball_scored(match_state['playerA']), loop)

            # Check if game has ended
            if match_state['scores'][match_state['playerA']['id']] >= MAX_SCORE or match_state['scores'][match_state['playerB']['id']] >= MAX_SCORE:
                winner_id = match_state['playerA']['id'] if match_state['scores'][match_state['playerA']['id']] >= MAX_SCORE else match_state['playerB']['id']
                asyncio.run_coroutine_threadsafe(self.send_match_update(), loop)
                asyncio.run_coroutine_threadsafe(self.send_match_end(winner_id), loop)
                break

            asyncio.run_coroutine_threadsafe(self.send_match_update(), loop)
            time.sleep(REFRESH_RATE)

    async def send_paddle_hit(self, player, ball):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "paddle.hit",
                "player": player,
                "ball": ball
            }
        )

    async def send_ball_hit(self, ball):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "ball.hit",
                "ball": ball
            }
        )

    async def ball_hit(self, event):
        try:
            await self.send_json({
                "e": "BALL_HIT",
                "d": {"ball": event["ball"]}
            })
        except Exception as _:
            pass

    async def paddle_hit(self, event):
        try:
            await self.send_json({
                "e": "PADDLE_HIT",
                "d": {"player": event["player"], "ball": event["ball"]}
            })
            logger.info(f"[{self.__class__.__name__}] Paddle hit event sent for player: {event['player']['id']}")
        except Exception as _:
            pass

    async def send_ball_scored(self, player):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "ball.scored",
                "player": player
            }
        )

    async def ball_scored(self, event):
        try:
            await self.send_json({
                "e": "BALL_SCORED",
                "d": {"player": event["player"]}
            })
            logger.info(f"[{self.__class__.__name__}] Ball scored event processed for player: {event['player']['id']}")
        except Exception as _:
            pass

    def reset_ball(self, match_state):
        if self.match.flags & (1 << 1):
            dx = random.choice([-8, -7])
        else:
            dx = random.choice([-8, -7, 7, 8])  # Increased ball speed slightly
        dy = random.choice([-8, -7, 7 , 8])
        match_state['ball'] = {'x': 600, 'y': 375, 'dx': dx, 'dy': dy}

    async def end_match(self, match_id, winner_id):
        if self.match:
            # Match already ended
            if self.match.winnerID is not None or self.match.finishedAt is not None:
                return None

            self.match.winnerID = winner_id
            self.match.finishedAt = timezone.now()
            self.match.startedAt = timezone.datetime.fromisoformat(self.active_matches[match_id]['startedAt'])
            self.match.scores = self.active_matches[match_id]['scores']
            await self.save_match()

            winner_earnings = self.active_matches[match_id]['rewards'][winner_id]
            loser_id = self.match.playerA['id'] if self.match.playerB['id'] == winner_id else self.match.playerB['id']
            loser_earnings = self.active_matches[match_id]['rewards'][loser_id]

            if self.match.matchID in self.active_matches:
                logger.info(f"[{self.__class__.__name__}] Deleting match state for match: {self.match.matchID}")
                del self.active_matches[self.match.matchID]

            await self.reward_user(winner_id, winner_earnings['xp'], winner_earnings['money'])
            await self.reward_user(loser_id, loser_earnings['xp'], loser_earnings['money'])
            logger.info(f"[{self.__class__.__name__}] Match {match_id} ended. Winner: {winner_id}")

            # Check if the match is part of a tournament
            if self.match.tournament:
                await self.channel_layer.group_send(
                    f"tournament_{self.match.tournament.tournamentID}",
                    {
                        "type": "tournament_round_end",
                        "matchID": self.match.matchID,
                        "winner": winner_id
                    }
                )
                logger.info(f"[{self.__class__.__name__}] Tournament round end event sent for tournament: {self.match.tournament.tournamentID}")

            return {
                "type": "match.ended",
                "winner": winner_id,
                "rewards": {
                    "winner": winner_earnings,
                    "loser": loser_earnings
                }
            }

    async def reward_user(self, user_id, xp, money):
        try:
            loop = asyncio.get_event_loop()
            user = await loop.run_in_executor(None, lambda: User.objects.get(userID=user_id))
            user.xp += xp
            user.money += money
            logger.info(f"[{self.__class__.__name__}] Rewarding {user_id} with {xp} XP and {money} coins")
            await loop.run_in_executor(None, user.save)
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Cannot reward {user_id}, user not found")

    async def save_match(self):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.match.save)

    async def send_match_end(self, winner_id):
        self.stop_match(self.match.matchID)
        try:
            end_match_data = await self.end_match(self.match.matchID, winner_id)
            await self.channel_layer.group_send(
                f"match_{self.match.matchID}",
                end_match_data
            )
            logger.info(f"[{self.__class__.__name__}] Match end event sent for match: {self.match.matchID}")
        except Exception as _:
            pass

    async def match_ended(self, event):
        try:
            winner_user = await self.get_user_from_id(event["winner"])
            safe_profile = get_safe_profile(UserSerializer(winner_user).data, me=False)

            await self.send_json({
                "e": "MATCH_END",
                "d": {
                    "winner": event["winner"],
                    "winnerProfile": safe_profile,
                    "rewards": event["rewards"]
                }
            })
            logger.info(f"[{self.__class__.__name__}] Match end event processed for user: {self.user.userID}")
            await self.close()
        except Exception as _:
            pass

    async def player_join(self, event):
        player_data = event["player"]
        side = event["side"]

        if player_data['userID'] == self.user.userID:
            return

        if side == "playerB":
            self.match.playerB = {"id": player_data['userID'], "platform": ("web" if player_data
            ['userID'] != 'user_ai' else "server")}
        elif side == "playerA":
            self.match.playerA = {"id": player_data['userID'], "platform": "web" if player_data['userID'] != 'user_ai' else "server"}

        try:
            await self.send_json({
                "e": "PLAYER_JOIN",
                "d": player_data
            })
            logger.info(f"[{self.__class__.__name__}] Player join event sent for match: {self.match.matchID}")
        except Exception as _:
            pass
