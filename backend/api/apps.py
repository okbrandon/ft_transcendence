from django.apps import AppConfig
from django.db.models.signals import post_migrate

from .util import generate_id

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        post_migrate.connect(create_store_items)
        post_migrate.connect(delete_unfinished_matches)

def create_store_items(sender, **kwargs):
    from .models import StoreItem

    default_items = [
        {"itemID": generate_id("item"), "name": "Red Paddle Skin", "assetID": "red.jpeg", "price": 100},
        {"itemID": generate_id("item"), "name": "Neon Paddle Skin", "assetID": "neon.jpeg", "price": 150},
        {"itemID": generate_id("item"), "name": "Galaxy Paddle Skin", "assetID": "galaxy.jpeg", "price": 250},
        {"itemID": generate_id("item"), "name": "Luxury Paddle Skin", "assetID": "luxury.jpeg", "price": 300},
        {"itemID": generate_id("item"), "name": "Pepe Paddle Skin", "assetID": "pepe.jpeg", "price": 1000},
    ]

    for item in default_items:
        # Check if an item with the same name already exists
        if not StoreItem.objects.filter(name=item["name"]).exists():
            StoreItem.objects.create(**item)

def delete_unfinished_matches(sender, **kwargs):
    from .models import Match

    Match.objects.filter(finishedAt__isnull=True).delete()
    Match.objects.filter(playerB__isnull=True).delete()
