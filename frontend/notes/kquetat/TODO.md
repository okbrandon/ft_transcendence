# TODO

- Chat (!!) :
	- Enable game invite (gameserver) []
		- Use notification Context for enabling sending game invite notification []
	- The tournament system should be able to warn users expected for the next game []

- Search friends component:
	- Implement the Invite button, (TODO LATER : waiting for gameserver)

## To-do List *of the day*:

- [ ]  Tournament Winner Page:
    - [ ]  Implement Private Routing
    - [x]  Improve styling

### structure conversations chat

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
