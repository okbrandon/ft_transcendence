## TODO - today

- Add styling in DMWinHeader.
	- on:click:
		- dropdown to invite user to game party. (waiting for gameserver)
			- add a notification to user, to confirm that he wants to invite him.
		- dropdown to select block.
			- add a notification to user, to confirm the blocking of the user selected.
			- if person is blocked:
				- the blocked user cannot see the conversation anymore. (must double check)
				- (optional): custom message to say that user was blocked.
					- (optional): another custom message to the user that blocked, 'You blocked that user'.

- Search friends features:
	- Fix the feature.
		- Map through the list of friends.
	- Implement the Invite button, (TODO LATER : waiting for gameserver)
	- Block button,
	- Profile button,

- Implement status (online, offline)

- Implement notification:
	- When message received from any user:
		- implement smol notification badge on main Chat feature.
			- with notification number.

 (from: subject)
- The tournament system should be able to warn users expected for the next game.


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

- TODO (today):
	- Implement Back in leaderboard for stats.
	- Modify styling of the leaderboard table.
		- implement redirection to page of user when clicking on username.
	- make card prettier.
		- implement getUser.
		- small overview of the stats of the user.



- endpoint:
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



Structure:

	'userID': user['userID'],
			'stats': {
				'gamesPlayed': played,
				'gamesWon': wins,
				'gamesLost': losses
			},
			'period': {
				'type': period_type[period_type.index(period)] if period in period_type else 'lifetime',
				'from': start_date,
				'to': now
			}
}
```
