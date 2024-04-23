# API

A REST API is required for CRUD operations, authenticating the user, and querying the database in a safe, easy and reproducible manner. The API handles permissions based on the authentication (Bearer) JWT token passed the `Authorization` header in requests, so that the user can only query data they have access to.

# Authenticating

Authentication happens using the `POST /auth/login` and `POST /auth/otp` endpoints, the later being only used if the user has 2FA enabled.

The `POST /auth/login` endpoint takes a JSON object containing the `username` and `password` key-value.
The `POST /auth/otp` endpoint takes a JSON object containing the `otp` key and the 2FA code as the value.

Example auth login request:

```json
{
  "username": "user12333",
  "password": "rabbitsrcool"
}
```

If the user has 2FA enabled the server will return a `200 HTTP` response with a JSON body containing a `ticket` and `"mfa": true`, the user will then have to make a request to `POST /auth/otp` and pass the ticket and the OTP code as the `otp` key-value. If the OTP code is valid then the server will return another `200 HTTP` response with a JSON body containing a `token` key-value.

If the user doesn't have 2FA enabled then a `token` will be returned while making the first request to `POST /auth/login` that can be used to perform requests as the user for both the API and the Gateway.

# Querying user info

Authenticated users can query the `GET /users/:id` endpoint to retreive information about a specific user, the user can also query information about themselves using the special `@me` key as the user ID in the path.
