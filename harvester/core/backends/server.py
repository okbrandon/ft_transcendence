import time
import logging

from ..utils import *
from .database import *

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Tables and columns where the userID is stored
tables_and_columns = {
	"api_user": "userID",
	"api_purchase": "userID",
	"api_match": "json:id:playerA,json:id:playerB",
	"api_verificationcode": "userID",
	"api_usersettings": "userID",
	"api_relationship": "userA,userB",
}

def harvest_users():
	logger.debug("Harvesting users...")
	while True:
		user_ids, err = get_users_with_flag(1 << 3)
		if err:
			logger.error(f"Error fetching users with flag: {err}")
			continue

		for user_id in user_ids:
			user_data, err = get_user_data(user_id, tables_and_columns)
			if err:
				logger.error(f"Error fetching user data for userID {user_id}: {err}")
				continue

			logger.debug(f"User data retrieved for userID: {user_id}")

			err = export_csv(user_id, user_data)
			if err:
				logger.error(f"Error exporting CSV for userID {user_id}: {err}")
				continue

			logger.debug(f"CSV exported successfully for userID: {user_id}")

			err = zip_and_move(user_id)
			if err:
				logger.error(f"Error creating ZIP file for userID {user_id}: {err}")
				continue

			logger.info(f"ZIP export successful for userID: {user_id}")

		logger.debug("Sleeping for 3 minutes before next harvest")
		time.sleep(3 * 60)
