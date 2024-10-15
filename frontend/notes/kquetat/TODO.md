# NEW TODO

- Chat (!!) :
	- enable max characters input [x]
	- Enable instant access to messaging when adding a new friend [x]
	- Make Chat messages direct message work again [x]
	- Fix default avatar picture [x]
	- Enable blocking feature, where we cannot see the chat again [x]
	- if user is unblocked, re-fetch conversation with <targetuser> [x]
		- Use notification context for warning user that <targetuser> has been blocked. [x]
		- If user has been blocked already => notify: <targetuser> has been already blocked. [x]
	- Enable game invite (gameserver) []
		- Use notification Context for enabling sending game invite notification []
	- The tournament system should be able to warn users expected for the next game []
	- If a friend is removed, remove/hide the conversation correctly [x]

- Search friends component:
	- Fix the feature. [x]
		- Map through the list of friends. [x]
	- Implement the Invite button, (TODO LATER : waiting for gameserver)
	- Block button, [x]
	- Profile button,[x]

- Implement status (online, offline) [x]

- Implement notification:
	- When message received from any user:
		- implement small notification badge on main Chat feature.

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




## LeaderBoard:

# TODO:

- Finish the podium styling
- Edit the styling for the leaderbaord
	- re-cented the leaderboard
- Enable access to profile when clicking on a user

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
