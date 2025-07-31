# TaskShare API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

#### GET /auth/me
Get current user information. Requires authentication.

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /auth/logout
Logout current user. Requires authentication.

**Response:**
```json
{
  "message": "Logout successful"
}
```

### Lists

#### GET /lists
Get all lists (owned and shared). Requires authentication.

**Response:**
```json
{
  "ownedLists": [
    {
      "id": "list_id",
      "title": "My List",
      "ownerId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "shares": [],
      "_count": {
        "tasks": 5
      }
    }
  ],
  "sharedLists": []
}
```

#### POST /lists
Create a new list. Requires authentication.

**Request Body:**
```json
{
  "title": "New List"
}
```

#### PUT /lists/:id
Update a list. Requires authentication and ownership.

**Request Body:**
```json
{
  "title": "Updated List Title"
}
```

#### DELETE /lists/:id
Delete a list. Requires authentication and ownership.

#### POST /lists/:id/share
Share a list with another user. Requires authentication and ownership.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### DELETE /lists/:id/share/:userId
Remove sharing from a user. Requires authentication and ownership.

### Tasks

#### GET /lists/:listId/tasks
Get all tasks from a list. Requires authentication and access to the list.

**Response:**
```json
[
  {
    "id": "task_id",
    "title": "Task Title",
    "completed": false,
    "listId": "list_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "comments": 2
    }
  }
]
```

#### POST /lists/:listId/tasks
Create a new task. Requires authentication and access to the list.

**Request Body:**
```json
{
  "title": "New Task"
}
```

#### PUT /tasks/:id
Update a task. Requires authentication and access to the list.

**Request Body:**
```json
{
  "title": "Updated Task Title"
}
```

#### DELETE /tasks/:id
Delete a task. Requires authentication and access to the list.

#### PATCH /tasks/:id/toggle
Toggle task completion status. Requires authentication and access to the list.

### Comments

#### GET /tasks/:taskId/comments
Get all comments from a task. Requires authentication and access to the list.

**Response:**
```json
[
  {
    "id": "comment_id",
    "content": "Comment content",
    "taskId": "task_id",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
]
```

#### POST /tasks/:taskId/comments
Create a new comment. Requires authentication and access to the list.

**Request Body:**
```json
{
  "content": "Comment content"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Token required" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently, there are no rate limits implemented, but it's recommended to implement them in production.

## CORS

The API is configured to accept requests from the frontend URL specified in the environment variables.

## Interactive Documentation

When the server is running, you can access the interactive Swagger documentation at:
```
http://localhost:3001/api
```

This provides a web interface to test all endpoints directly from your browser.
