import psycopg2
import logging

from ..utils import *

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class StatDatabase():

	def __init__(self):
		self.connection = None
		self.cursor = None

		self.connect()

	def connect(self):
		db_host = 'postgres'
		db_port = '5432'
		db_user = get_env('POSTGRES_USER')
		db_password = get_env('POSTGRES_PASSWORD')
		db_name = get_env('POSTGRES_DB')

		conn_str = f"host={db_host} port={db_port} user={db_user} password={db_password} dbname={db_name} sslmode=disable"
		logger.debug(f"Connecting to database: {conn_str}")

		try:
			self.connection = psycopg2.connect(conn_str)
		except Exception as err:
			logger.error(f"Failed to open database connection: {err}")
			return

		self.cursor = self.connection.cursor()

	def disconnect(self):
		if self.cursor:
			self.cursor.close()
		if self.connection:
			self.connection.close()

	def get_users_all(self):
		query = 'SELECT * FROM api_user'
		logger.debug(f"Executing query: {query}")

		try:
			self.cursor.execute(query)
			rows = self.cursor.fetchall()
			column_names = [desc[0] for desc in self.cursor.description]
		except Exception as err:
			logger.error(f"Query execution failed: {err}")
			return None, err

		fields_to_keep = [
			"userID", "username", "displayName", "email",
			"mfaToken", "lang", "avatarID", "bannerID",
			"bio", "oauthAccountID", "phone_number", "password", "flags", "money"
		]

		users = [
			{key: user.get(key) for key in fields_to_keep if key in column_names}
			for user in [dict(zip(column_names, row)) for row in rows]
		]

		return users, None

	def get_matches_all(self):
		query = 'SELECT * FROM api_match'
		logger.debug(f"Executing query: {query}")

		try:
			self.cursor.execute(query)
			rows = self.cursor.fetchall()
			column_names = [desc[0] for desc in self.cursor.description]
		except Exception as err:
			logger.error(f"Query execution failed: {err}")
			return None, err

		fields_to_keep = [
			"matchID", "playerA", "playerB", "winnerID",
			"finishedAt", "createdAt", "updatedAt"
		]

		matches = [
			{key: match.get(key) for key in fields_to_keep if key in column_names}
			for match in [dict(zip(column_names, row)) for row in rows]
		]

		return matches, None
