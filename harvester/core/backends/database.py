import os
import psycopg2
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def get_env(key: str) -> str:
	value = os.getenv(key)
	if value:
		logging.debug(f"Environment variable retrieved: {key} = {value}")
		return value
	logging.debug(f"Environment variable not found: {key}")
	return ''

def get_users_with_flag(flag: int):
	db_host = 'postgres'
	db_port = '5432'
	db_user = get_env('POSTGRES_USER')
	db_password = get_env('POSTGRES_PASSWORD')
	db_name = get_env('POSTGRES_DB')

	conn_str = f"host={db_host} port={db_port} user={db_user} password={db_password} dbname={db_name} sslmode=disable"
	logging.debug(f"Connecting to database: {conn_str}")

	try:
		conn = psycopg2.connect(conn_str)
	except Exception as err:
		logging.error(f"Failed to open database connection: {err}")
		return None, err

	cursor = conn.cursor()

	query = 'SELECT "userID" FROM api_user WHERE (flags & %s) = %s'
	logging.debug(f"Executing query: {query} with flag {flag}")

	try:
		cursor.execute(query, (flag, flag))
		rows = cursor.fetchall()
	except Exception as err:
		logging.error(f"Query execution failed: {err}")
		return None, err

	user_ids = [row[0] for row in rows]
	logging.debug(f"UserIDs retrieved: {user_ids}")

	# Remove flag after collecting user IDs
	for user_id in user_ids:
		query = 'UPDATE api_user SET flags = flags & ~(CAST(%s AS integer)) WHERE "userID" = %s'
		try:
			cursor.execute(query, (flag, user_id))
			logging.debug(f"User flag removed successfully for userID: {user_id}")
		except Exception as err:
			logging.error(f"Error removing user flag for userID {user_id}: {err}")

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
	logging.debug(f"Connecting to database for user data: {conn_str}")

	try:
		conn = psycopg2.connect(conn_str)
	except Exception as err:
		logging.error(f"Failed to open database connection: {err}")
		return None, err

	cursor = conn.cursor()
	user_data = {}

	for table, column in table_columns.items():
		if ',' in column:
			columns = column.split(',')
			query = f'SELECT * FROM {table} WHERE "{columns[0]}" = %s OR "{columns[1]}" = %s'
		else:
			query = f'SELECT * FROM {table} WHERE "{column}" = %s'

		logging.debug(f"Executing query for user data: {query} with userID {user_id}")

		try:
			if ',' in column:
				cursor.execute(query, (user_id, user_id))
			else:
				cursor.execute(query, (user_id,))
			rows = cursor.fetchall()
		except Exception as err:
			logging.error(f"Query execution failed: {err}")
			return None, err

		columns = [desc[0] for desc in cursor.description]
		logging.debug(f"Columns retrieved: {columns}")

		data = [columns]  # First row is the column headers
		for row in rows:
			data.append([str(value) for value in row])
			logging.debug(f"Row data retrieved: {row}")

		user_data[table] = data
		logging.debug(f"User data for table {table} retrieved: {data}")

	cursor.close()
	conn.close()

	logging.debug(f"User data retrieval completed: {user_data}")
	return user_data, None
