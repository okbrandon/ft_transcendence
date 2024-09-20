import logging
import os
import time
import threading

from django.apps import AppConfig

logging.basicConfig(level=logging.DEBUG)

statcruncher_started = False

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        global statcruncher_started
        if os.environ.get('RUN_MAIN') != 'true' or statcruncher_started:
            return

        statcruncher_started = True
        logging.debug("Starting the statcruncher...")

        def statcruncher():
            while True:
                pass # Should start the leaderboard maker

        time.sleep(10)
        statcruncher_thread = threading.Thread(target=statcruncher)
        statcruncher_thread.daemon = True
        statcruncher_thread.start()
