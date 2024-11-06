## To-do List *of the day*:

- [ ]  Tournament Winner Page:
    - [ ]  Rethink the styling

# Tournament:
{
	"winner": {
        "userID": "user_X",
        "username": "caca",
        "displayName": null,
        "lang": "EN",
        "avatarID": null,
        [...]
    },
    "matches": [
        {
            "matchID": "match_X",
            "playerA": {
                "id": "user_X",
                "platform": "web"
            },
            "playerB": {
                "id": "user_Y",
                "platform": "web"
            },
            "scores": {
                "user_X": 8,
                "user_Y": 10
            },
            "winnerID": "user_Y",
            "startedAt": "2016-06-01T00:00:00Z",
            "finishedAt": "2016-06-01T00:00:00Z",
            "flags": 2
        },
        {
            "matchID": "match_Y",
            "playerA": {
                "id": "user_Y",
                "platform": "web"
            },
            "playerB": {
                "id": "user_Z",
                "platform": "web"
            },
            "scores": {
                "user_Y": 8,
                "user_Z": 10
            },
            "winnerID": "user_Z",
            "startedAt": "2016-06-01T00:00:00Z",
            "finishedAt": "2016-06-01T00:00:00Z",
            "flags": 2
        },
        [...]
    ]

	hanmin:
	{
    "matchID": "match_MTcyOTcwMzQwOTk4NzE5OTM",
    "playerA": {
        "userID": "user_MTcyOTI2MzMxMzQyMjk5NTA",
        "username": "hanmin",
        "displayName": "hanmin",
        "lang": "EN",
        "avatarID": "/images/default-avatar.png",
        "bannerID": "/images/default-banner.webp",
        "bio": null,
        "flags": 1,
        "status": {
            "online": true,
            "activity": "HOME",
            "last_seen": "2024-10-25T11:10:05.047019+00:00"
        },
        "xp": 214,
        "score": 10
    },
    "playerB": {
        "userID": "user_MTcyOTI2MzM2OTQwMjU2MTI",
        "username": "brandon",
        "displayName": "brandon",
        "lang": "EN",
        "avatarID": "/images/default-avatar.png",
        "bannerID": "/images/default-banner.webp",
        "bio": null,
        "flags": 1,
        "status": {
            "online": true,
            "activity": "HOME",
            "last_seen": "2024-10-23T17:11:15.940197+00:00"
        },
        "xp": 157,
        "score": 3
    },
    "scores": {
        "user_MTcyOTI2MzM2OTQwMjU2MTI": 3,
        "user_MTcyOTI2MzMxMzQyMjk5NTA": 10
    },
    "winnerID": "user_MTcyOTI2MzMxMzQyMjk5NTA",
    "startedAt": "2024-10-23T17:10:09.987660Z",
    "finishedAt": "2024-10-23T17:10:57.627729Z",
    "flags": 0,
    "duration": "0m 47s",
    "winner": {
        "userID": "user_MTcyOTI2MzMxMzQyMjk5NTA",
        "username": "hanmin",
        "displayName": "hanmin",
        "lang": "EN",
        "avatarID": "/images/default-avatar.png",
        "bannerID": "/images/default-banner.webp",
        "bio": null,
        "flags": 1,
        "status": {
            "online": true,
            "activity": "HOME",
            "last_seen": "2024-10-25T11:10:05.047019+00:00"
        },
        "xp": 214
    },
    "date": "2024/10/23"
}
}

# Conversations:
{
									1 CONVERSATION (Type: 'Array')
									   |
									   |--- 'type: 1/2': 'friends/blocked'
									   |
	0:---------|                       |--- 'conversationID': "conv_MTcyNjMwMjg5NjQ2MDc3Mg"
	1:---------| Conversations ------- |
	2:---------|                       |--- 'conversationType': 'private_message'
	                                   |
									   |                  1 message
									   |--- 'messages' ----|-- content
								       |                   |
								       |                   |-- createdAt: "2024-09-14T13:15:22.116212Z"
								       |                   |-- messageID: "msg_MTcyNjMxOTU5OTk4MDg4MzI"
								       |                   |-- sender ---------|
								       |				                       |
								       |									   |
								       |									   |---- avatarID
								       |									   |---- bannerID
								       |									   |---- bio
								       |									   |---- displayName
								       |									   |---- FLAGS
								       |									   |---- lang
								       |									   |---- userID
								       |									   |---- username
									   |
									   |
									   |--- 'participants' ---|
									                          |
															  |---|---- avatarID
								        						  |---- bannerID
								        					      |---- bio
								        					      |---- displayName
								        					      |---- FLAGS
								        						  |---- lang
								        						  |---- userID
								        						  |---- username
}

# Leaderboard:

- API ENDPOINTS:
	- leaderboards/`daily`
	- leaderboards/`weekly`
	- leaderboards/`lifetime`

with the param `stats` to get `gamesPlayed`, `gamesWon` or `gamesLost`
e.g. like GET leaderboards/daily/?stats=gamesPlayed
you can spam the HTTP request, no need to cache, it handles cache by itself

```
{
	|----- GET leaderboards/`daily/`?stats=`gamesPlayed`
						   /`weekly/`      `gamesWon`
						   /`lifetime/`    `gamesLost`

}

Structure:

{
	"userID": "string",  // The unique ID of the user
	"stats": {
		"gamesPlayed": "number",  // Total number of games played
		"gamesWon": "number",     // Total number of games won
		"gamesLost": "number"     // Total number of games lost (derived from matches)
	},
	"period": {
		"type": "string",	// 'daily', 'weekly', or 'lifetime'
		"from": "ISO8601 timestamp",	// Start of the period (only for daily/weekly)
		"to": "ISO8601 timestamp"		 // End of the period (current time)
	}
}
```
