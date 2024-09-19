import time
import logging

from ..utils import *
from .database import *

logging.basicConfig(level=logging.DEBUG)

# Tables and columns where the userID is stored
tables_and_columns = {
	"api_user": "userID",
	"api_purchase": "userID",
	#"api_match": "json:id:playerA,json:id:playerB",
	"api_verificationcode": "userID",
	"api_usersettings": "userID",
	"api_relationship": "userA,userB",
}

def harvest_users():
	logger.debug("Harvesting users...")
	while True:
		user_ids, err = get_users_with_flag(1 << 3)
		if err:
			logging.error("Error fetching users with flag: %s", err)
			continue

		logging.debug("Fetched user IDs: %d", len(user_ids))

		for user_id in user_ids:
			logging.info("Harvesting userID: %s", user_id)

			user_data, err = get_user_data(user_id, tables_and_columns)
			if err:
				logging.error("Error fetching user data for userID %s: %s", user_id, err)
				continue

			logging.debug("User data retrieved for userID: %s", user_id)

			err = export_csv(user_id, user_data)
			if err:
				logging.error("Error exporting CSV for userID %s: %s", user_id, err)
				continue

			logging.debug("CSV exported successfully for userID: %s", user_id)

			err = zip_and_move(user_id)
			if err:
				logging.error("Error creating ZIP file for userID %s: %s", user_id, err)
				continue

			logging.info("ZIP export successful for userID: %s", user_id)

		logging.debug("Sleeping for 3 minutes before next harvest")
		time.sleep(3 * 60)
