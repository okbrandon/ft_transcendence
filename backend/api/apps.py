from django.apps import AppConfig
from django.db.models.signals import post_migrate

from .util import generate_id

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        post_migrate.connect(create_store_items)

def create_store_items(sender, **kwargs):
    from .models import StoreItem

    default_items = [
        {"itemID": generate_id("item"), "name": "Basketball Ball Skin", "description": "Slam dunk in style with this vibrant basketball skin!", "price": 100},
        {"itemID": generate_id("item"), "name": "Rainbow Paddle Skin", "description": "Add a splash of color to your pong game with this rainbow paddle!", "price": 200},
    ]
    
    for item in default_items:
        # Check if an item with the same name already exists
        if not StoreItem.objects.filter(name=item["name"]).exists():
            StoreItem.objects.create(**item)