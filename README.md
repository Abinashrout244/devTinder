# 🚀 MERN Backend API

A production-ready backend built using **Node.js, Express, MongoDB, and JWT Authentication**.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- cookie-parser
- cors
- dotenv
- validator

---

## 📦 Dependencies

{
"bcryptjs": "^3.0.3",
"cookie-parser": "^1.4.7",
"cors": "^2.8.6",
"dotenv": "^17.3.1",
"express": "^4.22.1",
"jsonwebtoken": "^9.0.3",
"mongoose": "^9.0.1",
"validator": "^13.15.26"
}

---

## ⚙️ Environment Variables

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

## 🔐 Authentication

- Password hashing using bcryptjs
- JWT authentication using jsonwebtoken
- Token stored in HTTP-only cookies
- Protected routes secured with auth middleware

---

### Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/logout   | Logout user   |

### Profile Routes

| Method | Endpoint          | Description                                      |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | /profile/view     | Get profile (Protected)                          |
| PUT    | /profile/edit     | Update profile (Protected)                       |
| PUT    | /profile/password | Change Password (or) Forget Password (Protected) |

### Request Routes

| Method | Endpoint                                     | Description                                             |
| ------ | -------------------------------------------- | ------------------------------------------------------- |
| POST   | /request/send/:status/:userId                | Send connection Request To Other User (Protected)       |
| POST   | /request/review/:status/:ConnectionRequestId | Review The connection Request To Other User (Protected) |

status:["intrested","ignored","accepted","rejected"]

### Profile Routes

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | /user/requests/recieved   | saw The Requests (Protected)   |
| GET    | /user/connections         | Saw All conections (Protected) |
| GET    | /user/feed?page=1&limit=2 | Saw The Users Feed (Protected) |

---

## 🛡 Security Best Practices

- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookies
- Environment variables secured
- Input validation using validator
- Restricted CORS origin
- Centralized error handling
- MongoDB connection error handling

---

## 📌 Production Checklist

- Set NODE_ENV=production
- Use strong JWT_SECRET
- Use MongoDB Atlas (not local DB)
- Enable HTTPS
- Secure cookies configuration:

## 👨‍💻 Author

Built with ❤️ using MERN Stack.
