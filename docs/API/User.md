# User Endpoints Documentation

Notes:
- This documentation is intended to be useful but may not always be up-to-date. For the most accurate and current information, please refer to the actual code. There is no guarantee that this documentation will be immediately updated after code changes.
- If you're reading this documentation from a local repository, be aware that it might not reflect the latest changes in the upstream repository. Always check the official documentation or the most recent version in the main repository for the most up-to-date information.
- User harvesting begins within 60 seconds maximum after requesting data using the POST /users/@me/harvest endpoint.
- User deletion begins 10 minutes after a deletion request has been made. The user can cancel the deletion request by logging into their account within that time period.

## Get Current User Profile
**Endpoint:** `GET /users/@me/profile`

Retrieves the profile information of the currently authenticated user.

### Example Request:
```
GET /users/@me/profile
Authorization: Bearer <access_token>
```

### Example Response:
```json
{
  "userID": "user_123456789",
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "lang": "en",
  "avatarID": "base64_encoded_image_data",
  "flags": 1,
  "money": 1000,
  "bannerID": "base64_encoded_banner_image",
  "bio": "Hello, I'm John!"
}
```

## Update Current User Profile
**Endpoint:** `PATCH /users/@me/profile`

Updates the profile information of the currently authenticated user.

### Example Request:
```
PATCH /users/@me/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "displayName": "Johnny",  // was previously "John"
  "email": "johnny@example.com", // was previously "johnny@rabbitmail.com"
  "avatarID": "new_base64_encoded_image_data", // was previously empty
  "bannerID": "new_base64_encoded_banner_image", // was previously empty
  "bio": "Updated bio for Johnny" // was previously empty
}
```

Note: The list of fields you can modify can be found in backend/api/views/users.py search for `allowed_fields`
Note: You should only specify the properties you want updated.

### Example Response:
```json
{
  "userID": "user_123456789",
  "username": "johndoe",
  "displayName": "Johnny",
  "email": "johnny@example.com",
  "lang": "en",
  "avatarID": "new_base64_encoded_image_data",
  "flags": 1,
  "money": 1000,
  "bannerID": "new_base64_encoded_banner_image",
  "bio": "Updated bio for Johnny"
}
```

## Get User Profile
**Endpoint:** `GET /users/<identifier>/profile`

Retrieves the profile information of a specific user by their userID or username.

### Example Request:
```
GET /users/johndoe/profile
Authorization: Bearer <access_token>
```

### Example Response:
```json
{
  "userID": "user_123456789",
  "username": "johndoe",
  "displayName": "John Doe",
  "lang": "en",
  "avatarID": "base64_encoded_image_data",
  "flags": 1,
  "money": 1000,
  "bannerID": "base64_encoded_banner_image",
  "bio": "Hello, I'm John!"
}
```

Note: The email field is not included in the response for privacy reasons.
Note: The identifier in the path can be a user ID or a username.

## Get Current User Matches
**Endpoint:** `GET /users/@me/matches`

Retrieves the match history of the currently authenticated user.

### Example Request:
```
GET /users/@me/matches
Authorization: Bearer <access_token>
```

### Example Response:
```json
[
  {
    "matchID": "match_987654321",
    "playerA": {"id": "user_123456789", "platform": "terminal"},
    "playerB": {"id": "user_987654321", "platform": "web"},
    "scores": {"user_123456789": 5, "user_987654321": 3},
    "startedAt": "2023-08-29T14:30:00Z",
    "finishedAt": "2023-08-29T15:00:00Z",
    "flags": 0
  },
  {
    "matchID": "match_123456789",
    "playerA": {"id": "user_123456789", "platform": "terminal"},
    "playerB": {"id": "user_456789123", "platform": "mobile"},
    "scores": {"user_123456789": 3, "user_456789123": 5},
    "startedAt": "2023-08-28T10:00:00Z",
    "finishedAt": "2023-08-28T10:30:00Z",
    "flags": 0
  }
]
```

## Get User Matches
**Endpoint:** `GET /users/<userID>/matches`

Retrieves the match history of a specific user by their userID.

### Example Request:
```
GET /users/user_123456789/matches
Authorization: Bearer <access_token>
```

### Example Response:
```json
[
  {
    "matchID": "match_987654321",
    "playerA": {"id": "user_123456789", "platform": "terminal"},
    "playerB": {"id": "user_987654321", "platform": "web"},
    "scores": {"user_123456789": 5, "user_987654321": 3},
    "startedAt": "2023-08-29T14:30:00Z",
    "finishedAt": "2023-08-29T15:00:00Z",
    "flags": 0
  },
  {
    "matchID": "match_123456789",
    "playerA": {"id": "user_123456789", "platform": "terminal"},
    "playerB": {"id": "user_456789123", "platform": "mobile"},
    "scores": {"user_123456789": 3, "user_456789123": 5},
    "startedAt": "2023-08-28T10:00:00Z",
    "finishedAt": "2023-08-28T10:30:00Z",
    "flags": 0
  }
]
```

## Get Current User Settings
**Endpoint:** `GET /users/@me/settings`

Retrieves the settings of the currently authenticated user.

### Example Request:
```
GET /users/@me/settings
Authorization: Bearer <access_token>
```

### Example Response:
```json
{
  "userID": "user_123456789",
  "theme": "dark",
  "colorblind": false
}
```

## Update Current User Settings
**Endpoint:** `PATCH /users/@me/settings`

Updates the settings of the currently authenticated user.

### Example Request:
```
PATCH /users/@me/settings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "theme": "light",
  "colorblind": true
}
```

### Example Response:
```json
{
  "userID": "user_123456789",
  "theme": "light",
  "colorblind": true
}
```

Note: Similar to patching the user's profile, you should only specify what you want updated.

## Get Current User Data Export
**Endpoint:** `GET /users/@me/exports`

Retrieves the data export zip file for the currently authenticated user.

### Example Request:
```
GET /users/@me/exports
Authorization: Bearer <access_token>
```

### Example Response:
The response will be a downloadable ZIP file containing the user's data.

Note: The data export zip file is only available if the user has requested a data export (see /users/@me/harvest)

## Get Current User Relationships
**Endpoint:** `GET /users/@me/relationships`

Retrieves the relationships (friends, pending requests, blocked users) of the currently authenticated user.

### Example Request:
```
GET /users/@me/relationships
Authorization: Bearer <access_token>
```

### Example Response:
```json
[
  {
    "relationshipID": "rel_123456789",
    "userA": "user_123456789",
    "userB": "user_987654321",
    "status": 1
  },
  {
    "relationshipID": "rel_987654321",
    "userA": "user_123456789",
    "userB": "user_456789123",
    "status": 0
  }
]
```

## Update User Relationship
**Endpoint:** `PUT /users/@me/relationships`

Updates or creates a relationship between the current user and another user.

### Example Request:
```
PUT /users/@me/relationships
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user": "user_987654321",
  "type": 1
}
```

### Example Response:
```json
{
  "status": "You are now friends"
}
```

## Get User Harvest Status
**Endpoint:** `GET /users/@me/harvest`

Checks if the current user is scheduled for data harvesting.

### Example Request:
```
GET /users/@me/harvest
Authorization: Bearer <access_token>
```

### Example Response:
```json
{
  "scheduled_harvesting": true
}
```

## Schedule User Harvest
**Endpoint:** `POST /users/@me/harvest`

Schedules the current user for data harvesting.

### Example Request:
```
POST /users/@me/harvest
Authorization: Bearer <access_token>
```

### Example Response:
A 204 No Content response indicates successful scheduling.

## Cancel User Harvest
**Endpoint:** `DELETE /users/@me/harvest`

Cancels the scheduled data harvesting for the current user.

### Example Request:
```
DELETE /users/@me/harvest
Authorization: Bearer <access_token>
```

### Example Response:
A 204 No Content response indicates successful cancellation.

## Get User Deletion Status
**Endpoint:** `GET /users/@me/delete`

Checks if the current user is scheduled for account deletion.

### Example Request:
```
GET /users/@me/delete
Authorization: Bearer <access_token>
```

### Example Response:
```json
{
  "scheduled_deletion": true
}
```

## Schedule User Deletion
**Endpoint:** `POST /users/@me/delete`

Schedules the current user for account deletion.

### Example Request:
```
POST /users/@me/delete
Authorization: Bearer <access_token>
```

### Example Response:
A 204 No Content response indicates successful scheduling.

## Cancel User Deletion
**Endpoint:** `DELETE /users/@me/delete`

Cancels the scheduled account deletion for the current user.

### Example Request:
```
DELETE /users/@me/delete
Authorization: Bearer <access_token>
```

### Example Response:
A 204 No Content response indicates successful cancellation.

## Search Users
**Endpoint:** `GET /users/search`

Searches for users based on a query string.

### Example Request:
```
GET /users/search?content=john
Authorization: Bearer <access_token>
```

### Example Response:
```json
[
  {
    "userID": "user_123456789",
    "username": "johndoe",
    "displayName": "John Doe",
    "lang": "en",
    "avatarID": "base64_encoded_image_data",
    "flags": 1,
    "money": 1000,
    "bannerID": "base64_encoded_banner_image",
    "bio": "Hello, I'm John!"
  },
  {
    "userID": "user_987654321",
    "username": "johnny123",
    "displayName": "Johnny Smith",
    "lang": "en",
    "avatarID": "base64_encoded_image_data",
    "flags": 1,
    "money": 500,
    "bannerID": "base64_encoded_banner_image",
    "bio": "Johnny here!"
  }
]
```