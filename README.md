# Overview

Welcome to the User Management API repository! This project started with my desire to explore and "re-explore" 😂 backend concepts and technologies, particularly in Node JS using the Express framework. It started with an exploration of a simple user account management system, but as I continue to learn more concepts, it is evolving to include more features and functionalities extending beyond the initial purpose I had for the repository.

With this repository, I aim to create a learning environment, with each new commit, feature or bug fix representing a step forward in my learning .

Feel free to explore, contribute, or even take inspiration from this repository as it slowly continues to develop.👩‍💻

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [API Endpoints](#api-endpoints)
   - [Create User Account](#1-create-user-account)
   - [Login User](#2-login-user)
   - [Refresh Access Token](#3-refresh-access-token)
   - [Get All Users](#4-get-all-users)
   - [Update User Information](#5-update-user-information)
   - [Delete User](#6-delete-user)
4. [Technologies Used](#technologies-used)
5. [Contributing](#contributing)
6. [Future Considerations](#future-considerations)
7. [Further Information](#further-information)

---

## [Features](#table-of-contents)
- **Create Account**: Allows users to create new accounts with email and password.
- **Login**: Allows users to log in with email and password.
- **Refresh Tokens**: Refresh access tokens without requiring the user to log in again.
- **Get All Users**: Retrieves all created users of the system with support for search, filtering and pagination.
- **Update User Information**: Allows for users to update information.
- **Delete User**: Delete a user from the database.

---

## [Getting Started](#table-of-contents)


### Prerequisites
Before you run this project, ensure you have the following installed:

- `Node.js and npm (or yarn)`
- `A database (e.g., MongoDB, PostgreSQL, etc.) ; preferrably PostreSQL`

### Installation
1. Clone the repository:
   ``` git clone https://github.com/Mohammed-Hanan-Othman/user-management-api.git ```

2. Navigate to the project directory:
   ``` cd user-management-api ``` 

3. Install the dependencies:
   ```npm install ``` 

4. Set up your environment variables (e.g., database connection, JWT secret) by creating a `.env` file:
   You may alter these values as per your configuration
   ```
   PORT=8000
   DB_SALT=10
   DATABASE_URL="postgresql://username:password@localhost:db-port/database-name?schema=public"
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_secret_for_token_refresh
   ```

5. Start the server:
   ```
   npm start
   ```

Your API should now run on `http://localhost:8000` (or whichever port you configured).

## [API Endpoints](#table-of-contents)

### 1. [**Create Account**](#api-endpoints)

- **Endpoint**: `POST /api/v1/users`
- **Description**: Creates a new user account.

#### Request

```json
POST /api/v1/users
{
    "name": "newStudent",
    "email": "newstudentemail@email.com",
    "role": "user", 
    "password": "userpassword"
}
```

#### Response

- **Success (201)**

```json
{
	"message": "User created successfully",
	"data": {
		"id": "random-id",
		"name": "newStudent",
		"email": "newstudentemail@email.com",
		"role": "user",
		"createdAt": "date-created-at",
		"updatedAt": "date-created-at"
	}
}
```

- **Error (400)**

```json
{
  "message": "Email already in use."
}
```

- **Error (400)**

```json
{
	"message": "Validation failed",
	"errors": [
		{
			"type": "field",
			"msg": "Name cannot be empty",
			"path": "name",
			"location": "body"
		},
		{
			"type": "field",
			"msg": "Email cannot be empty",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Email is invalid",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"msg": "Password cannot be empty",
			"path": "password",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Password must be at least 6 characters long",
			"path": "password",
			"location": "body"
		}
	]
}
```

### 2. [**Login User**](#api-endpoints)

- **Endpoint**: `POST api/v1/auth/login`
- **Description**: Logs in a user and provides an access token and refresh token.

#### Request

```json
POST /api/users/login
{
    "email": "newstudentemail@email.com",
    "password": "userpassword"
}
```

#### Response 

- **Success (200)**

The refresh token is stored as a cookie
```json
{
	"message": "Login successful",
	"data": {
		"id": "random-id",
		"name": "newStudent",
		"email": "newstudentemail@email.com",
		"role": "user",
		"accessToken": "some-access-token"
	}
}
```

- **Error (400)**

```json
{
	"message": "Validation failed",
	"errors": [
		{
			"type": "field",
			"msg": "Email cannot be empty",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Email is invalid",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"msg": "Password cannot be empty",
			"path": "password",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Password must be at least 6 characters long",
			"path": "password",
			"location": "body"
		}
	]
}
```

- **Error (401)**

```json
{
	"message": "Invalid credentials"
}
```

### 3. [**Refresh token**](#api-endpoints)

- **Endpoint**: `POST api/v1/auth/refresh`
- **Description**: Refreshes the access token using a refresh token provided

#### Request

##### Request Headers

Authorization : `Bearer some-access-token`

##### Request Body
```json
POST api/v1/auth/refresh
{
  "refreshToken": "your-refresh-token"
}
```

#### Response

- **Success (200)**

A new refresh token is generated and stored as a cookie.

```json
{
	"message": "Token refreshed successfully",
	"accessToken": "new-access-token"
}
```

### 4. [**Get All Users**](#api-endpoints)

- **Endpoint**: `GET /api/v1/users?page=1&limit=10&sort=name&order=asc`
- **Description**: Gets all users. Allows filtering, searching and ordering parameters.

#### Parameters
- `page`: The page number to fetch (default: 1).
- `limit`: The number of items per page (default: 20).
- `search`: A value to search for (performed on name or email).
- `sort`: A field with which to sort the data.
- `order`: Sorting order for the data based on the `sort` field.

- **Description**: Retrieves all users.

#### Response

- **Success (200)**

```json
{
	"message": "Fetched users successfully",
	"metadata": {
		"total_records": 56,
		"total_pages": 6,
		"current_page": 1,
		"limit": 10
	},
	"data": [
		{
			"id": "random-id",
			"name": "username",
			"email": "email@email.com",
			"role": "user",
			"createdAt": "date-created-at",
            "updatedAt": "date-updated-at"
		},
        {
			"id": "random-id",
			"name": "username",
			"email": "email@email.com",
			"role": "user",
			"createdAt": "date-created-at",
            "updatedAt": "date-updated-at"
		},
		// ... more records
	]
}
```

### 5. [**Update User Information**](#api-endpoints)
- **Description**: Update a user's information

#### Request

- Endpoint : `PUT /api/v1/users/:userId`

##### Headers

Authorization: `Bearer some-access-token`

##### Body
```json
{
    "name":"new name",
    "email":"new email"
}
```

#### Response

- **Success (200)**

```json
{
	"message": "User updated successfully",
	"data": {
		"id": "random-id",
		"name":"new name",
        "email":"new email",
		"createdAt": "date-created-at",
		"updatedAt": "new-date-updated-at"
	}
}
```
- **Error (401)**
```json
{
    "message":"Access denied"
}
```

- **Error (401)**

```json
{
    "message":"Token invalid or expired"
}
```

### 6. [**Delete User**](#api-endpoints)
- **Description**: Deletes a single user.

#### Request

- Endpoint : `DELETE /api/v1/users/:userId`

- **Headers**
Authorization : `Bearer some-access-token`

#### Response
- **Success (200)**
```json
{
	"message": "User deleted successfully",
	"data": {
		"id": "random-id",
		"name": "user name",
		"email": "useremail@email.com",
		"role": "user",
		"createdAt": "date-created-at",
		"updatedAt": "date-updated-at"
	}
}
```

- **Error (400)**
```json
{
	"message": "Validation failed",
	"errors": [
		{
			"type": "field",
			"value": "random",
			"msg": "User id not provided or invalid",
			"path": "id",
			"location": "params"
		}
	]
}
```

- **Error (401)**
```json
{
	"message": "Deletion unauthorized. Only admins can delete users"
}
```

## [Technologies Used](#table-of-contents)
- Node.js
- Express
- JWT (JSON Web Tokens) for authentication
- PostgreSQL (or other database options based on your setup)
- bcryptjs (for hashing passwords)
- express validator (for input validation)
- Prisma ORM (for database querying)
All unlisted technologies can be inferred from the `package.json` file

## [Contributing](#table-of-contents)
Want to improve this repository or report issues? Feel free to fork the repository and submit pull request with the necessary improvements. Feel free to open an issue ticket if need be.

## [Future Considerations](#table-of-contents)
- Add forgot password functionality (preferrably using email address).
- Add filtering by date for the `GET /api/v1/users` endpoint.

## [Further Information](#table-of-contents)
This repostory takes some inspiration from my [Blog Management API](https://github.com/Mohammed-Hanan-Othman/blog-platform-api) repository. Feel free to explore.