import sys
import logging

from django.apps import AppConfig

from .backends.database import StatDatabase
from .backends.statcruncher import StatCruncher

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DATABASE = None
STATCRUNCHER = None

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        is_manage = 'manage.py' in sys.argv
        is_dev_mode = 'runserver' in sys.argv or '--in-development' in sys.argv

        if is_manage or is_dev_mode:
            logger.debug("StatCruncher is disabled in development mode.")
            return

        logger.debug("Starting the StatCruncher...")

        global DATABASE
        global STATCRUNCHER

        DATABASE = StatDatabase()
        STATCRUNCHER = StatCruncher(DATABASE)
