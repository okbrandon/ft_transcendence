# API

A REST API is required for CRUD operations, authenticating the user, and querying the database in a safe, easy and reproducible manner. The API handles permissions based on the authentication (Bearer) JWT token passed the `Authorization` header in requests, so that the user can only query data they have access to.

## Authenticating

Authentication happens using the `POST /auth/token`.

The `POST /auth/token` endpoint takes a JSON object containing the `username` and `password` key-value.

Example auth login request:

```json
{
  "username": "evan",
  "password": "rabbitsrcool"
}
```

The server returns a JSON object containing two tokens: `refresh` and `access`. The access token is used to authenticate requests and expires after 24 hours, at which point it becomes invalid. To obtain a new access token, the user can use the refresh token with the /auth/token/refresh endpoint, provided the refresh token is still valid (refresh tokens are valid for 7 days). If the refresh token is no longer valid, the user will need to log in again.

### Handling 401 Unauthenticated

Receiving a 401 HTTP status code from a request made to the API server indicates one of two issues: either the request was malformed and did not include the `Authorization` header with the user’s access token, or the token was included but has since expired.

In the latter case, the client (frontend/terminal) should automatically attempt to obtain a new access token from the `/auth/token/refresh` endpoint using the refresh token. The client should then use the newly returned access token for future requests.

If the refresh token has also expired, the user should be redirected to the login page and prompted to log in again.

### Creating a user

User accounts can be created using the `POST /auth/register` endpoint, which requires the following JSON body:

```json
{
  "username": "Test",
  "password": "super_secure",
  "email": "test@evan.sh",
  "lang": "en" // can be "fr" or "en"
}
```

The server will respond with the newly created user object. The user will then need to log in, as the register endpoint does not return authentication tokens.

# Relationships

Relationships are objects which represent a relationship between two users. A relationship can be a pending friend request, a friend relationship, or a block relationship.

```json
{
  "id": "1718350562393",
  "type": 1,
  "user": {
    "id": "1718303952393",
    "username": "evan",
    "displayName": "Evan",
    "avatar": "cca6c527e4e9f6266c33d1559b0e5a0904de8c91",
    "lang": "en",
    "flags": 0
  },
  "since": "2020-09-02T21:04:45.464000+00:00"
}
```

## Relationships Types

| Name                   | Type | Description                                                          |
|------------------------|------|----------------------------------------------------------------------|
| Pending friend request | 0    | `userA` sent a friend request to `userB`, which is not yet answered. |
| Friend                 | 1    | `userA` and `userB` are friends.                                     |
| Block                  | 2    | `userA` blocked `userB`                                              |

## Get logged-in user relationships

You can query the currently logged-in user using the `GET /users/@me/relationships` endpoint, it will then return a JSON array containing relationships objects.

Example response:
```json
[
  {
    "id": "1718350562393",
    "type": 1,
    "user": {
      "id": "1718303952393",
      "username": "evan",
      "displayName": "Evan",
      "avatar": "cca6c527e4e9f6266c33d1559b0e5a0904de8c91",
      "lang": "en",
      "flags": 0
    },
    "since": "2020-09-02T21:04:45.464000+00:00"
  },
  {
    "id": "1715330530003",
    "type": 2,
    "user": {
      "id": "1718300562393",
      "username": "brandon",
      "displayName": "Brandon",
      "avatar": "916fade2c498a8503638974bbc53cc1866fdd62f1",
      "lang": "en",
      "flags": 0
    },
    "since": "2020-09-02T21:04:45.464000+00:00"
  }
]
```

# Querying user profiles

Authenticated users can query the `GET /users/:id/profile` endpoint to retreive information about a specific user profile, the user can also query information about themselves using the special `@me` key as the user ID in the path.

# Querying user matches

Authenticated users can query the `GET /users/:id/matches` endpoint to retreive information about a specific user matches, the user can also query information about themselves using the special `@me` key as the user ID in the path.