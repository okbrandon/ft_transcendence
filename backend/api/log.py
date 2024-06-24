import requests
import json

def log_to_discord(title, description=None):
    webhook_url = "https://canary.discord.com/api/webhooks/1253713068739919943/39SncAOdefeUH_P7USH_SxF9M-Cb44ox8Y1ePh42nOor9C3wypC1GQVJBnl_pV01-FlJ"
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
