## Notes

Once connected to `/ws/match`, BOT needs to identify itself like so:
```json
{
    "e": "IDENTIFY",
    "d": {
        "token": "b8e2947870fc450d8e2ccaad868e9268"
    }
}
```

Now that the BOT is identified, it should force join the match:
```json
{
    "e": "MATCHMAKE_FORCE_JOIN",
    "d": {
        "match_id": "match_MTcyODQ2Mjg5MTU2MzgxMjk"
    }
}
```
