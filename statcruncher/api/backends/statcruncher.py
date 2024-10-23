import logging

from django.utils import timezone

from ..utils import get_safe_profile

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class StatCruncher():

	def __init__(self, database):
		self.database = database

	def get_user_stats(self, matches, user, period):
		now = timezone.now()
		period_type = ['daily', 'weekly', 'lifetime']

		if period == period_type[0]:
			start_date = now - timezone.timedelta(days=1)
		elif period == period_type[1]:
			start_date = now - timezone.timedelta(weeks=1)
		else: # Lifetime
			start_date = None

		matches = [match for match in matches if match['playerA']['id'] == user['userID'] or match['playerB']['id'] == user['userID']]

		if start_date:
			matches = [match for match in matches if timezone.make_aware(match['finishedAt'].replace(tzinfo=None)) >= start_date]

		played = len(matches)
		wins = len([match for match in matches if match['winnerID'] == user['userID']])
		losses = played - wins

		return {
			'userID': user['userID'],
			'stats': {
				'gamesPlayed': played,
				'gamesWon': wins,
				'gamesLost': losses
			},
			'period': {
				'type': period_type[period_type.index(period)] if period in period_type else 'lifetime',
				'from': start_date,
				'to': now
			}
		}, None

	def get_leaderboard(self, period, order_by):
		users, err = self.database.get_users_all()
		global_stats = {}

		if err:
			logger.debug(f"Failed to retrieve users: {err}")
			return err

		matches, err = self.database.get_matches_all()

		if err:
			logger.debug(f"Failed to retrieve matches: {err}")
			return None, err

		if users:
			for user in users:
				user_id = user['userID']
				global_stats[user_id], _ = self.get_user_stats(matches, user, period)

		leaderboard_data = [
			{
				'user': get_safe_profile(user, me=False),
				'stats': {
					'gamesPlayed': global_stats[user['userID']]['stats']['gamesPlayed'],
					'gamesWon': global_stats[user['userID']]['stats']['gamesWon'],
					'gamesLost': global_stats[user['userID']]['stats']['gamesLost']
				}
			}
			for user in users
		]

		leaderboard_data.sort(key=lambda x: x['stats'][order_by], reverse=True)
		return leaderboard_data[:50] # Top 50
