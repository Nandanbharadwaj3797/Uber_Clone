# API Documentation

## User Registration

### Endpoint

`POST /user/register`

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
