# Authentication Endpoints Documentation

## 1. User Registration

### Register a New User
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user account.
- **Request Body**: JSON object with user registration details.
- **Response**: Returns the created user object and a verification link.

**Example Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "lang": "en"
}
```

**Example Response:**
```json
{
  "userID": "user_987654321",
  "username": "newuser",
  "displayName": "newuser",
  "email": "newuser@example.com",
  "lang": "en",
  "avatarID": "default",
  "flags": 0,
  "money": 0
}
```

## 2. User Login

### Log In a User
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and returns access and refresh tokens.
- **Request Body**: JSON object with login credentials.
- **Response**: Returns access and refresh tokens.

**Example Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "existinguser",
  "password": "userpassword123"
}
```

**Example Response:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. Token Refresh

### Refresh Access Token
- **Endpoint**: `POST /auth/token/refresh`
- **Description**: Uses a refresh token to obtain a new access token.
- **Request Body**: JSON object with the refresh token.
- **Response**: Returns a new access token.

**Example Request:**
```http
POST /auth/token/refresh
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 4. Two-Factor Authentication (TOTP)

### Enable TOTP
- **Endpoint**: `POST /auth/totp/enable`
- **Description**: Enables Two-Factor Authentication for the user.
- **Response**: Returns a TOTP token for the user to set up in their authenticator app.

**Example Request:**
```http
POST /auth/totp/enable
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
  "message": "TOTP enabled successfully.",
  "token": "JBSWY3DPEHPK3PXP"
}
```

Note: The token is the part that should be rendered as a QR code or given to the user so they can add it to their OTP app.

### Confirm TOTP
- **Endpoint**: `POST /auth/totp/confirm`
- **Description**: Confirms the TOTP setup by verifying a code.
- **Request Body**: JSON object with the TOTP code.
- **Response**: Confirms successful TOTP setup.

**Example Request:**
```http
POST /auth/totp/confirm
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Example Response:**
```json
{
  "message": "OTP confirmed successfully."
}
```

### Delete TOTP
- **Endpoint**: `POST /auth/totp/delete`
- **Description**: Disables Two-Factor Authentication for the user.
- **Response**: Confirms TOTP has been disabled.

**Example Request:**
```http
POST /auth/totp/delete
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
  "message": "MFA has been disabled."
}
```

## 5. Login with 42

### Initiate OAuth Login
- **Endpoint**: `GET /auth/42/login`
- **Description**: Initiates the OAuth2 login process with 42 API.
- **Response**: Redirects the user to the 42 API authorization page.

**Example Request:**
```http
GET /auth/42/login
```

**Example Response:**
The user will be redirected to the 42 API authorization page.

### OAuth Callback
- **Endpoint**: `GET /auth/42/callback`
- **Description**: Handles the callback from 42 API after user authorization.
- **Query Parameters**: 
  - `code`: The authorization code from 42 API.
- **Response**: Redirects the user to the application with access and refresh tokens.

**Example Request:**
```http
GET /auth/42/callback?code=authorization_code_from_42_api
```

**Example Response:**
The user will be redirected to:
```
<BASE_URL>/callback?token=<access_token>&refresh=<refresh_token>
```

Note: The token and refresh token are Pong account tokens, not 42 credentials. They should be treated in the same way
as returned credentials from `POST /auth/login`.

## 6. Email Verification

### Verify Email
- **Endpoint**: `POST /verify`
- **Description**: Verifies a user's email address using a verification code.
- **Request Body**: JSON object with the verification code.
- **Response**: Confirms successful email verification.

**Example Request:**
```http
POST /verify
Content-Type: application/json

{
  "code": "base64_encoded_verification_code"
}
```

**Example Response:**
```json
{
  "message": "Email verified successfully."
}
```