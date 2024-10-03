import logging
import time
import threading
import sys

from django.apps import AppConfig

from core.backends.server import harvest_users

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        is_manage = 'manage.py' in sys.argv
        is_dev_mode = 'runserver' in sys.argv or '--in-development' in sys.argv

        if is_manage or is_dev_mode:
            logger.debug("Harvester is disabled in development mode.")
            return

        logger.debug("Starting the Harvester...")

        def harvester():
            while True:
                harvest_users()

        time.sleep(10)
        harvester_thread = threading.Thread(target=harvester)
        harvester_thread.daemon = True
        harvester_thread.start()
