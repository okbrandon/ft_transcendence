# NEW TODO

- Chat (!!) :
	- Enable instant access to messaging when adding a new friend [x]
	- Make Chat messages direct message work again [x]
	- Fix default avatar picture
	- Enable blocking feature, where we cannot see the chat again
		- Use notification context for warning user that <targetuser> has been blocked.
		- If user has been blocked already => notify: <targetuser> has been already blocked.
	- Enable game invite (gameserver)
		- Use notification Context for enabling sending game invite notification
	- The tournament system should be able to warn users expected for the next game
	- Re-enable the redirection to the profile
	- If a friend is removed, remove the conversation correctly
	{
		// when removing a friend

			const handleRemove = relationID => {
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				addNotification("success", "Friend removed");
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification("error", `${err?.response?.data?.error || "An error occurred."}`);
			});
	};


	}

- Search friends component:
	- Fix the feature.
		- Map through the list of friends.
	- Implement the Invite button, (TODO LATER : waiting for gameserver)
	- Block button,
	- Profile button,

- Implement status (online, offline)

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
