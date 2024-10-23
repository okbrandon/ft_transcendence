import os
import psycopg2
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_env(key: str) -> str:
	value = os.getenv(key)
	if value:		
		return value
	logger.debug(f"Environment variable not found: {key}")
	return ''

def get_users_with_flag(flag: int):
	db_host = 'postgres'
	db_port = '5432'
	db_user = get_env('POSTGRES_USER')
	db_password = get_env('POSTGRES_PASSWORD')
	db_name = get_env('POSTGRES_DB')
	conn_str = f"host={db_host} port={db_port} user={db_user} password={db_password} dbname={db_name} sslmode=disable"

	try:
		conn = psycopg2.connect(conn_str)
	except Exception as err:
		logger.error(f"Failed to open database connection: {err}")
		return None, err

	cursor = conn.cursor()

	query = 'SELECT "userID" FROM api_user WHERE (flags & %s) = %s'

	try:
		cursor.execute(query, (flag, flag))
		rows = cursor.fetchall()
	except Exception as err:
		logger.error(f"Query execution failed: {err}")
		return None, err

	user_ids = [row[0] for row in rows]
	logger.debug(f"There are {len(user_ids)} users to harvest")

	# Remove flag after collecting user IDs
	for user_id in user_ids:
		query = 'UPDATE api_user SET flags = flags & ~(CAST(%s AS integer)) WHERE "userID" = %s'
		try:
			cursor.execute(query, (flag, user_id))
		except Exception as err:
			logger.error(f"Error removing user flag for userID {user_id}: {err}")

	conn.commit()
	cursor.close()
	conn.close()

	return user_ids, None

def get_user_data(user_id: str, table_columns: dict):
	db_host = 'postgres'
	db_port = '5432'
	db_user = get_env('POSTGRES_USER')
	db_password = get_env('POSTGRES_PASSWORD')
	db_name = get_env('POSTGRES_DB')
	conn_str = f"host={db_host} port={db_port} user={db_user} password={db_password} dbname={db_name} sslmode=disable"

	try:
		conn = psycopg2.connect(conn_str)
	except Exception as err:
		logger.error(f"Failed to open database connection: {err}")
		return None, err

	cursor = conn.cursor()
	user_data = {}

	for table, column in table_columns.items():
		if ',' in column:
			columns = column.split(',')

			if columns[0].startswith("json:"):
				identifier = columns[0].split(':')[1]
				first_column = columns[0].split(':')[2]
				second_column = columns[1].split(':')[2]
				query = f'SELECT * FROM {table} WHERE "{first_column}"->>\'{identifier}\' = %s::text OR "{second_column}"->>\'{identifier}\' = %s::text'
			else:
				query = f'SELECT * FROM {table} WHERE "{columns[0]}" = %s OR "{columns[1]}" = %s'
		else:
			query = f'SELECT * FROM {table} WHERE "{column}" = %s'

		logger.debug(f"Executing query for user data: {query} with userID {user_id}")

		try:
			if ',' in column:
				cursor.execute(query, (user_id, user_id))
			else:
				cursor.execute(query, (user_id,))
			rows = cursor.fetchall()
		except Exception as err:
			logger.error(f"Query execution failed: {err}")
			return None, err

		columns = [desc[0] for desc in cursor.description]

		data = [columns] # First row is the column headers
		for row in rows:
			data.append([str(value) for value in row])

		user_data[table] = data

	cursor.close()
	conn.close()

	logger.debug(f"Completed data extraction for userID {user_id}")
	return user_data, None
