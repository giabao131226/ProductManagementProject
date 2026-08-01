````markdown
# 🚀 Product Management

A full-stack web application built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **Socket.IO**, and **Pug**. The system provides a complete product management solution with an administration dashboard, user authentication, real-time chat, and friend management.

---

## ✨ Features

### 👤 Client

#### Authentication
- Register account
- Login / Logout
- Forgot password via Email OTP
- Change password
- Authentication using Cookies & Sessions

#### User Profile
- View profile
- Update personal information
- Upload avatar
- Change password

#### Product
- Browse products
- View product details
- Search products
- Filter products by category
- Sort products
- Pagination

#### Friend System
- Send friend requests
- Cancel friend requests
- Accept friend requests
- Reject friend requests
- View friends list
- View sent requests
- View received requests

#### Realtime Chat
- One-to-one chat
- Send text messages
- Send images
- Emoji support
- Typing indicator
- Auto-scroll to newest message

#### Notifications
- Friend request notifications
- Friend request accepted
- Friend request rejected
- Friend request cancelled

---

### 🔐 Admin

#### Dashboard
- View system statistics
- Total products
- Total categories
- Total accounts
- Active / Inactive statistics

#### Product Management
- View products
- Add new products
- Edit products
- Delete products
- Change product status
- Search products
- Filter products
- Pagination
- Upload product images

#### Product Category Management
- Create categories
- Update categories
- Delete categories
- Category tree
- Change category status

#### Account Management
- View accounts
- Create administrator accounts
- Update accounts
- Lock / Unlock accounts
- Delete accounts
- Search accounts

#### Role & Permission Management
- Create roles
- Update roles
- Delete roles
- Assign permissions
- Authorization Middleware

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Frontend

- Pug
- Bootstrap 5
- HTML5
- CSS3
- JavaScript (ES6)

### Libraries

- Cloudinary
- Multer
- Express Session
- Cookie Parser
- dotenv
- MD5
- Moment.js

---

## 🏗 Architecture

This project follows the **MVC (Model - View - Controller)** architecture.

```
Client
    │
    ▼
Routes
    │
    ▼
Controllers
    │
    ▼
Models
    │
    ▼
MongoDB
```

---

## 📂 Project Structure

```
Product-Management
│
├── config/
├── controllers/
├── helpers/
├── middlewares/
├── models/
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── uploads/
├── routes/
├── sockets/
├── views/
├── app.js
├── package.json
├── .env.example
└── README.md
```

---

## ⚙️ Installation

Clone repository

```bash
git clone https://github.com//Product-Management.git
```

Go to project

```bash
cd Product-Management
```

Install dependencies

```bash
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file.

```env
PORT=3000

MONGO_URL=

SESSION_SECRET=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

EMAIL=
PASSWORD=
```

---

## ▶️ Run Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Visit

```
http://localhost:3000
```

---

## 💬 Realtime Features

Socket.IO is used to synchronize data between connected users in real time.

- Chat messages
- Typing indicator
- Friend requests
- Accept requests
- Reject requests
- Cancel requests

---

## 🗄 Database Collections

Example collections

- users
- roles
- products
- product-categories
- chats
- chat-details

---

## 📸 Screenshots

### Login

_Add screenshot here._

---

### Dashboard

_Add screenshot here._

---

### Product Management

_Add screenshot here._

---

### Product Detail

_Add screenshot here._

---

### Chat

_Add screenshot here._

---

### Friend Management

_Add screenshot here._

---

## 🚀 Future Improvements

- Group chat
- Product reviews
- Product ratings
- Wishlist
- Shopping cart
- Responsive admin dashboard
- Dark mode
- Push notifications

---

## 👨‍💻 Author

**Đỗ Đức Gia Bảo**

Information Technology Student
---

## 📄 License

This project is developed for learning and portfolio purposes.
````
