# web-unv-front


````md
# SarahaApp Frontend

Frontend for the SarahaApp anonymous messaging platform built using React.

---

## Features

- User Authentication (Login / Signup)
- OTP Verification
- Protected Routes
- Profile Management
- Anonymous Messaging UI
- Admin Dashboard
- Profile Image Upload
- Responsive Design

---

## Technologies Used

- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript

---

## Project Structure

src/
│
├── components/
├── pages/
├── services/
├── routes/
├── assets/
├── context/
├── App.jsx
└── main.jsx

---

## Installation

1. Clone the repository

```bash
git clone <repository-url>
````

2. Navigate to frontend folder

```bash
cd frontend
```

3. Install dependencies

```bash
npm install
```

4. Create environment variables file

Create a `.env` file and add:

```env
VITE_API_URL=http://localhost:3000
```

5. Start development server

```bash
npm run dev
```

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Main Pages

* Login Page
* Signup Page
* OTP Verification Page
* Profile Page
* Messages Page
* Admin Dashboard

---

## Authentication Flow

1. User signs up
2. OTP is sent to email
3. User verifies OTP
4. User logs in
5. JWT token stored on frontend
6. Protected routes become accessible

---

## API Communication

The frontend communicates with the backend using REST APIs.

Example:

```js
axios.post('/auth/login', data)
```

---

## Route Protection

Protected routes are accessible only for authenticated users.

Example:

* Profile Page
* Messages Page
* Admin Dashboard

---

## Admin Features

* View Users
* Search Users
* Delete Users

---

## Future Improvements

* Dark Mode
* Real-time Messaging
* Mobile Responsive Improvements
* Notifications
* Socket.IO Integration

---

## Author

SarahaApp Team

````

---

# README_BACKEND.md

```md
# SarahaApp Backend

Backend REST API for the SarahaApp anonymous messaging platform built using Node.js and Express.

---

## Features

- User Authentication & Authorization
- JWT Authentication
- OTP Email Verification
- Anonymous Messaging System
- Admin Dashboard APIs
- File Upload Handling
- Request Validation
- Redis OTP Storage
- MongoDB Integration

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Redis
- Nodemailer
- Multer
- Zod

---

## Project Structure

src/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── messages/
│   └── admin/
│
├── middlewares/
├── utils/
├── DB/
├── services/
├── app.controller.js
└── index.js

---

## Installation

1. Clone the repository

```bash
git clone <repository-url>
````

2. Navigate to backend folder

```bash
cd backend
```

3. Install dependencies

```bash
npm install
```

4. Create `.env` file

```env
PORT=3000
DB_URL=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL=your_email
EMAIL_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

5. Start server

```bash
npm run dev
```

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

---

## Authentication

Authentication is handled using JWT.

After login, a token is generated and used to protect private routes.

Example Header:

```http
Authorization: Bearer TOKEN
```

---

## API Endpoints

### Authentication APIs

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /auth/signUp        | Register User    |
| POST   | /auth/login         | Login User       |
| POST   | /auth/confirm-email | Verify OTP       |
| GET    | /auth/profile       | Get User Profile |
| POST   | /auth/logout        | Logout User      |

---

### Message APIs

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /message/send-message | Send Anonymous Message |
| GET    | /message/my-messages  | Get User Messages      |

---

### User APIs

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | /users/user-profile | Get User Profile |

---

### Admin APIs

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| GET    | /admin/get-users    | Get All Users |
| GET    | /admin/search-users | Search Users  |
| DELETE | /admin/delete-user  | Delete User   |

---

## OTP Verification Workflow

1. User signs up
2. OTP generated
3. OTP stored in Redis
4. Email sent using Nodemailer
5. User submits OTP
6. Backend verifies OTP
7. Email becomes verified

---

## Security Features

### Password Hashing

Passwords are hashed using bcrypt.

### Validation

Requests validated using Zod.

### Authorization

Admin-only routes are protected.

### OTP Expiration

OTP automatically expires after a specific time.

---

## File Uploads

Multer is used for handling profile image uploads.

---

## Database Models

### User Model

```js
{
  firstName,
  lastName,
  email,
  password,
  gender,
  role,
  profileImage,
  confirmEmail
}
```

### Message Model

```js
{
  body,
  to,
  createdAt
}
```

---

## Future Improvements

* Socket.IO Integration
* AI Moderation
* Cloud Image Storage
* Notifications System
* Rate Limiting
* Logging System

---

## Author

SarahaApp Team

```
```
