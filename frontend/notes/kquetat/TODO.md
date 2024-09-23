## TODO - today

- Fix horizontal scroll
-

- Send to `conversationID` the `content` with type `send_message`.
- Cleanup file structure
- Add styling into chat
	- Chat Bubbbles

### structure conversations chat

{
									1 CONVERSATION (Type: 'Array')
									   |
									   |
									   |
	0:---------|                       |--- 'conversationID': "conv_MTcyNjMwMjg5NjQ2MDc3Mg"
	1:---------| Conversations ------- |
	2:---------|                       |--- 'conversationType': 'private_message'
									   |--- 'receipientID': 'user_quelquechose'
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



# POSTMAN

bsoubaig: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MTcyNjI4LCJpYXQiOjE3MjcwODYyMjgsImp0aSI6ImM5NjljMmFjNjU5OTRmYjA5YjllMjE2OWExZWRiYzYxIiwidXNlcl9pZCI6Mn0.EtoA2rlpBan_BDZzgk87wvoZ95btNo7gH8TeHc3G8jA"

"userID": "user_MTcyNzA4NjIwMzAzNzg0ODc"

kiki: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MTcyODMyLCJpYXQiOjE3MjcwODY0MzIsImp0aSI6IjlmZTEzMTlkNGFjOTRiMTc4MjEwNjNkNWE1Y2YwMzI3IiwidXNlcl9pZCI6MX0.GqJ_5NjL-lgCTCmPlE73ymtFmnecU8TQAv_jqW4IFGU"

userID: "user_MTcyNjk0MDI0MTk0NDMwMDM"

## LeaderBoard

- endpoint:
