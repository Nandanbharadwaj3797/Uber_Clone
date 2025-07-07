# API Documentation

## User Registration

### Endpoint

`POST /users/register`

### Description

Registers a new user with the provided details. It validates the input, hashes the password, creates a new user in the database, and returns a JWT for authentication.

### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Validation Rules

- `fullname.firstname`: Must be a string with a minimum length of 3 characters.
- `email`: Must be a valid email format.
- `password`: Must be a string with a minimum length of 6 characters.

### Responses

#### Success Response

- **Status Code:** `201 Created`
- **Content:** A JSON object containing the authentication token and the created user's details (excluding the password).

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5f2c5c7b8f8b8f8b8f8b8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error Responses

- **Status Code:** `400 Bad Request`
- **Description:** This response is sent if the request body fails validation.
- **Content:** A JSON object with an `errors` array detailing the validation failures.

```json
{
  "errors": [
    {
      "value": "jo",
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server.
- **Content:** A JSON object with an `error` message.

```json
{
  "error": "An internal server error occurred."
}
```

## User Login

### Endpoint

`POST /users/login`

### Description

Authenticates an existing user with their email and password. On successful authentication, it returns a JWT for future requests.

### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Validation Rules

- `email`: Must be a valid email format.
- `password`: Must be a string with a minimum length of 6 characters.

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object containing the authentication token and the user's details.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5f2c5c7b8f8b8f8b8f8b8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error Responses

- **Status Code:** `400 Bad Request`
- **Description:** This response is sent if the request body fails validation (e.g., invalid email format, password too short).
- **Content:** A JSON object with an `errors` array detailing the validation failures.

- **Status Code:** `401 Unauthorized`
- **Description:** This response is sent if the provided email or password is incorrect.
- **Content:** A JSON object with an error message.

```json
{
  "message": "Invalid email or password"
}
```

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server.
- **Content:** A JSON object with an `error` message.

## Get User Profile

### Endpoint

`GET /users/profile`

### Description

Retrieves the profile information of the currently authenticated user. This is a protected route and requires a valid JWT to be provided in the `Authorization` header as a Bearer token or in a cookie.

### Headers

- `Authorization`: `Bearer <jwt_token>` (if not using cookies)

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object containing the user's details (excluding the password).

```json
{
  "_id": "60d5f2c5c7b8f8b8f8b8f8b8",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

#### Error Responses

- **Status Code:** `401 Unauthorized`
- **Description:** This response is sent if the token is missing, invalid, or the user is not found.
- **Content:** A JSON object with an error message.

```json
{
  "message": "Unauthorized"
}
```

## User Logout

### Endpoint

`GET /users/logout`

### Description

Logs the user out by invalidating their current session. It blacklists the JWT, making it unusable for future requests, and clears the session cookie.

### Headers

- `Authorization`: `Bearer <jwt_token>` (if not using cookies)

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object with a success message.

```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

- **Status Code:** `401 Unauthorized`
- **Description:** This response is sent if the token is missing or invalid.
- **Content:** A JSON object with an error message.

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server during the logout process.
- **Content:** A JSON object with an `error` message.

## Captain Registration

### Endpoint

`POST /captain/register`

### Description

Registers a new captain with their personal and vehicle details. It validates the input, checks for existing captains, hashes the password, and returns a JWT upon successful registration.

### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "strongpassword123",
  "vehicles": {
    "color": "Blue",
    "plate": "XYZ-123",
    "capacity": 4,
    "vehiclesType": "car"
  }
}
```

### Validation Rules

- `fullname.firstname`: Required, min 3 characters.
- `email`: Must be a valid email.
- `password`: Required, min 6 characters.
- `vehicles.color`: Required, min 3 characters.
- `vehicles.plate`: Required, min 3 characters.
- `vehicles.capacity`: Must be an integer between 1 and 5.
- `vehicles.vehiclesType`: Must be one of `car`, `bike`, or `Auto`.

### Responses

#### Success Response

- **Status Code:** `201 Created`
- **Content:** A JSON object with a success message, JWT, and the new captain's details.

```json
{
  "message": "Captain registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "id": "60d5f2c5c7b8f8b8f8b8f8b9",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicles": {
      "color": "Blue",
      "plate": "XYZ-123",
      "capacity": 4,
      "vehiclesType": "car"
    }
  }
}
```

#### Error Responses

- **Status Code:** `400 Bad Request`
- **Description:** Sent if validation fails or the captain already exists.
- **Content:** A JSON object with an `errors` array or an `error` message.

- **Status Code:** `500 Internal Server Error`
- **Description:** Sent for any unexpected server errors.
- **Content:** A JSON object with an `error` message.

## Captain Login

### Endpoint

`POST /captain/login`

### Description

Authenticates an existing captain with their email and password. On successful authentication, it returns a JWT for future requests and sets a cookie.

### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "email": "jane.doe@example.com",
  "password": "strongpassword123"
}
```

### Validation Rules

- `email`: Must be a valid email format.
- `password`: Must be a string with a minimum length of 6 characters.

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object containing the authentication token and the captain's details.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "60d5f2c5c7b8f8b8f8b8f8b9",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "status": "offline",
    "vehicles": {
      "color": "Blue",
      "plate": "XYZ-123",
      "capacity": 4,
      "vehiclesType": "car"
    },
    "socketId": "socket_1234567890"
  }
}
```

#### Error Responses

- **Status Code:** `400 Bad Request`
- **Description:** This response is sent if the request body fails validation or if the email/password is incorrect.
- **Content:** A JSON object with an `errors` array or an `error` message.

```json
{
  "error": "Invalid email or password"
}
```

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server.
- **Content:** A JSON object with an `error` message.

## Get Captain Profile

### Endpoint

`GET /captain/profile`

### Description

Retrieves the profile information of the currently authenticated captain. This is a protected route and requires a valid JWT to be provided in the `Authorization` header as a Bearer token or in a cookie.

### Headers

- `Authorization`: `Bearer <jwt_token>` (if not using cookies)

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object containing the captain's details (excluding the password).

```json
{
  "_id": "60d5f2c5c7b8f8b8f8b8f8b9",
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "status": "offline",
  "vehicles": {
    "color": "Blue",
    "plate": "XYZ-123",
    "capacity": 4,
    "vehiclesType": "car"
  },
  "socketId": "socket_1234567890",
  "location": {
    "lat": 0,
    "lng": 0
  }
}
```

#### Error Responses

- **Status Code:** `401 Unauthorized`
- **Description:** This response is sent if the token is missing, invalid, or the captain is not found.
- **Content:** A JSON object with an error message.

```json
{
  "message": "Unauthorized"
}
```

- **Status Code:** `404 Not Found`
- **Description:** This response is sent if the captain is not found in the database.
- **Content:** A JSON object with an error message.

```json
{
  "error": "Captain not found"
}
```

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server.
- **Content:** A JSON object with an `error` message.

## Captain Logout

### Endpoint

`GET /captain/logout`

### Description

Logs the captain out by invalidating their current session. It blacklists the JWT, making it unusable for future requests, and clears the session cookie.

### Headers

- `Authorization`: `Bearer <jwt_token>` (if not using cookies)

### Responses

#### Success Response

- **Status Code:** `200 OK`
- **Content:** A JSON object with a success message.

```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

- **Status Code:** `401 Unauthorized`
- **Description:** This response is sent if the token is missing or invalid.
- **Content:** A JSON object with an error message.

```json
{
  "message": "Unauthorized"
}
```

- **Status Code:** `500 Internal Server Error`
- **Description:** This response is sent if there is an unexpected error on the server during the logout process.
- **Content:** A JSON object with an `error` message.
