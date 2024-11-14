import time
import logging
import resend

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

def send_data_package_ready_email(userID: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    # Get user email from database
    user_data, err = get_user_data(userID, {"api_user": "userID"})
    if err:
        logger.error(f"Error fetching user data for userID {userID}: {err}")
        return

    user_email = user_data["api_user"][1][user_data["api_user"][0].index("email")]

    params: resend.Emails.SendParams = {
        "from": "noreply@transcendence.evan.sh",
        "to": user_email,
        "subject": "Your Data Package is Ready",
        "html": f"""
            <h1>Your Data Package is Ready</h1>
            <p>We've prepared your data package as requested.</p>
            <p>To download your user package:</p>
            <ol>
                <li>Log in to your account</li>
                <li>Go to Settings</li>
                <li>Click on 'Data Privacy'</li>
                <li>You'll find the option to download your user package there</li>
            </ol>
            <p>Thank you for being a part of our community!</p>
        """,
    }

    email = resend.Emails.send(params)

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
			send_data_package_ready_email(user_id)

		logger.debug("Sleeping for 3 minutes before next harvest")
		time.sleep(3 * 60)
