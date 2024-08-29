# Store Endpoints Documentation

## 1. List Store Items

### Get All Store Items
- **Endpoint**: `GET /store/items`
- **Description**: Retrieves a list of all available items in the store.
- **Response**: Returns an array of store item objects.

**Example Request:**
```http
GET /store/items
Authorization: Bearer <access_token>
```

**Example Response:**
```json
[
  {
    "itemID": "item_123456",
    "name": "Golden Ball",
    "description": "Your opponent will be so jealous of your new golden ball",
    "price": 1000
  },
  {
    "itemID": "item_789012",
    "name": "Rainbow Paddle",
    "description": "A skin for your paddle, it's rainbow, yey..",
    "price": 1500
  }
]
```

## 2. User Purchases

### Get User's Purchase History
- **Endpoint**: `GET /users/@me/purchases`
- **Description**: Retrieves the purchase history of the currently authenticated user.
- **Response**: Returns an array of purchase objects.

**Example Request:**
```http
GET /users/@me/purchases
Authorization: Bearer <access_token>
```

**Example Response:**
```json
[
  {
    "purchaseID": "purchase_123456",
    "userID": "user_789012",
    "itemID": "item_123456",
    "purchaseDate": "2023-08-29T14:30:00Z"
  },
  {
    "purchaseID": "purchase_789012",
    "userID": "user_789012",
    "itemID": "item_789012",
    "purchaseDate": "2023-08-28T10:15:00Z"
  }
]
```

## 3. Make a Purchase

### Purchase an Item
- **Endpoint**: `POST /store/<itemID>/purchase`
- **Description**: Allows the authenticated user to purchase a specific item from the store.
- **URL Parameters**:
  - `itemID`: The unique identifier of the item to be purchased.
- **Response**: Returns the details of the newly created purchase.

**Example Request:**
```http
POST /store/item_123456/purchase
Authorization: Bearer <access_token>
```

**Example Response:**
```json
{
  "purchaseID": "purchase_345678",
  "userID": "user_789012",
  "itemID": "item_123456",
  "purchaseDate": "2023-08-29T15:45:00Z"
}
```

**Error Responses:**

1. Item Not Found
```json
{
  "error": "Item not found"
}
```
Status Code: 404 Not Found

2. Insufficient Funds
```json
{
  "error": "Insufficient funds"
}
```
Status Code: 400 Bad Request

## Notes:
- All endpoints require authentication. Include the user's access token in the Authorization header of each request.
- The server will automatically deduct the item's price from the user's account balance upon successful purchase.
- Users can only purchase items if they have sufficient funds in their account.
- The purchase history is ordered from most recent to oldest purchases.
- Store item prices are in the game's currency units.