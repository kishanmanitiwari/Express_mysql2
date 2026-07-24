# Express Authentication API

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and add the following variables:

```env
DB_USER=
DB_PASSWORD=
DB_DB=

JWT_SECRET_KEY=
SESSION_SECRET=
```

### 4. Configure the database

Ensure your MySQL server is running and update the `.env` file with your database credentials.

Example:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_DB=express_auth_db

JWT_SECRET_KEY=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### 5. Start the server

```bash
npm start
```

or, if using Nodemon:

```bash
npm run dev
```

The server will start at:

```
http://localhost:3000
```

## Features

- User CRUD Operations
- JWT Authentication
- Session Authentication
- Cookie Parser
- Express Session
- Input Validation using Express Validator
- Global Error Handling
- MySQL Database Integration

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- express-session
- cookie-parser
- express-validator
- dotenv
- morgan
