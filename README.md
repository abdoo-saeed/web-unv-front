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
````

