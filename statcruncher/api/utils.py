import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_env(name: str, default: str = None):
	value = os.getenv(name)

	if value:
		logger.debug(f"Found environment variable: {name}={value}")
		return value

	logger.debug(f"Environment variable not found: {name}")
	return default

def get_safe_profile(data: dict, me: bool, many: bool = False):
	if many:
		return [get_safe_profile(item, me, False) for item in data]

	safe_data = data.copy()
	fields_to_remove = ['password', 'mfaToken', 'oauthAccountID']

	if not me:
		fields_to_remove.extend(['email', 'phone_number', 'money'])

	for field in fields_to_remove:
		safe_data.pop(field, None)

	return safe_data
