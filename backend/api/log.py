import requests
import json
import os

def log_to_discord(title, description=None):
    webhook_url = os.environ.get('WEBHOOK_DISCORD')
    embed = {
        "title": title,
        "description": description,
        "color": 242424
    }
    data = {
        "embeds": [embed],
    }
    result = requests.post(webhook_url, data=json.dumps(data), headers={"Content-Type": "application/json"})
    
    if 200 <= result.status_code < 300:
        print(f"Webhook sent {result.status_code}")
    else:
        print(f"Not sent with {result.status_code}, response: {result.json()}")
