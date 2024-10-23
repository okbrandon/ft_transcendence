import base64

from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.utils import timezone

from .util import generate_id

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        post_migrate.connect(create_store_items)
        post_migrate.connect(delete_unfinished_matches)
        post_migrate.connect(create_ai_account)
        post_migrate.connect(update_users_statuses)

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

def create_ai_account(sender, **kwargs):
    from .models import User

    if not User.objects.filter(userID="user_ai").exists():
        encoded_avatar = None
        with open("static/ai_avatar.jpg", "rb") as f:
            encoded_avatar = base64.b64encode(f.read()).decode('utf-8')

        User.objects.create(
            userID="user_ai",
            username='ai',
            displayName='Prune',
            email='prune@brandoncodes.dev',
            password='',
            lang='EN',
            avatarID=f"data:image/jpeg;base64,{encoded_avatar}",
            flags=3
        )

def delete_unfinished_matches(sender, **kwargs):
    from .models import Match

    Match.objects.filter(finishedAt__isnull=True).delete()
    Match.objects.filter(playerB__isnull=True).delete()

def update_users_statuses(sender, **kwargs):
    from .models import User

    users = User.objects.all()

    for user in users:
        user.status = {
            "online": False,
            "activity": None,
            "last_seen": timezone.now().isoformat()
        }

    User.objects.bulk_update(users, ['status'])
