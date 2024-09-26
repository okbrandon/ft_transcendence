## TODO - today

- Add feature to interact with profile picture and access that person's profile. (redirection to profile page)
	- Add styling in DMWinHeader.
		- on:hover: underline the username.
		- on:click:
			- dropdown to select profile.
				- redirect to page profile.
			- dropdown to invite user to game party.
				- add a notification to user, to confirm that he wants to invite him.
			- dropdown to select block.
				- add a notification to user, to confirm the blocking of the user selected.
				- if person is blocked:
					- the blocked user cannot see the conversation anymore.
					- (optional): custom message to say that user was blocked.
						- (optional): another custom message to the user that blocked, 'You blocked that user'.

- Search friends features:
	- Fix the feature.
		- Map through the list of friends.
	- Implement the Invite button,
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
									   |
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




## LeaderBoard

- endpoint:
