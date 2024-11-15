import base64
import os

from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from .util import generate_id

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        post_migrate.connect(create_store_items)
        post_migrate.connect(delete_unfinished_matches)
        post_migrate.connect(create_ai_account)
        post_migrate.connect(update_users_statuses)
        post_migrate.connect(create_test_accounts)

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
    import random
    from .models import User, UserSettings, StoreItem, Purchase

    if not User.objects.filter(userID="user_ai").exists():
        encoded_avatar = None
        with open("static/ai_avatar.jpg", "rb") as f:
            encoded_avatar = base64.b64encode(f.read()).decode('utf-8')

        User.objects.create(
            userID="user_ai",
            username='ai',
            displayName='Prune 🤖',
            email='prune@brandoncodes.dev',
            password='',
            lang='EN',
            avatarID=f"data:image/jpeg;base64,{encoded_avatar}",
            flags=3
        )
    else:
        ai_account = User.objects.get(userID="user_ai")
        ai_account.displayName = 'Prune 🤖'
        ai_account.save()

    settings, _ = UserSettings.objects.get_or_create(userID="user_ai")
    store_items = StoreItem.objects.all()

    for item in store_items:
        _, _ = Purchase.objects.get_or_create(userID="user_ai", itemID=item.itemID, purchaseID=generate_id("purchase"))

    selected_skin = random.choice(store_items).itemID
    settings.selectedPaddleSkin = selected_skin
    settings.save()

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

def create_test_accounts(sender, **kwargs):
    from .models import User, Relationship

    if os.environ.get('SKIP_EMAIL_VERIFICATION', '').lower() == 'true':
        for i in range(1, 5):
            username = f'test{i}'
            if not User.objects.filter(username=username).exists():
                User.objects.create(
                    userID=generate_id('user'),
                    username=username,
                    email=f'{username}@example.com',
                    password=make_password('test123'),
                    lang='EN',
                    flags=1,  # Set EMAIL_VERIFIED flag
                    money=100000
                )
