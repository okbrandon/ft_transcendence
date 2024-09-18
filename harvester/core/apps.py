import logging
import time
import threading
import os

from django.apps import AppConfig
from core.backends.server import harvest_users

logging.basicConfig(level=logging.DEBUG)

harvester_started = False

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        global harvester_started
        if os.environ.get('RUN_MAIN') != 'true' or harvester_started:
            return

        harvester_started = True
        logging.debug("Starting the harvester...")

        def harvester():
            while True:
                harvest_users()

        time.sleep(10)
        harvester_thread = threading.Thread(target=harvester)
        harvester_thread.daemon = True
        harvester_thread.start()
