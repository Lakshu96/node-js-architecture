
# 🚀 Node.js Scalable Architecture (MySQL + MongoDB)

This project is a modular and scalable Node.js backend setup using a combination of **functional and class-based programming**. It supports both **MySQL** (via Sequelize) and **MongoDB** (via Mongoose), and includes essential features like authentication, email verification, Socket.io with Redis, multi-language support, and AWS S3 file upload.

---

## ✨ Features

- ✅ Authentication with JWT
- ✅ Email Verification
- ✅ Sequelize Migrations & Seeders
- ✅ MongoDB Integration via Mongoose
- ✅ Multi-language support using i18n
- ✅ Pagination
- ✅ File Upload (Local & AWS S3)
- ✅ Socket.io communication with Redis
- ✅ Scalable and layered code structure

---

## 🛠️ Setup Instructions

### 📦 Requirements

- Node.js v18+
- MySQL v8+
- MongoDB v5+
- Redis server
- AWS S3 credentials (for production)

---

### 🔧 Installation Steps

1. **Clone the Repository**

```bash
git clone https://github.com/Lakshu96/node-js-architecture.git
cd node-js-architecture
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

```bash
cp .env.example .env
# Fill in DB credentials, JWT secrets, mail, AWS, etc.
```

4. **Run Sequelize Commands to Setup Database**

```bash
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. **Run the Application**

```bash
npm run dev   # Development mode
npm run start # Production mode
```

---

## 🛡️ Authentication & Email Verification

- JWT-based auth (access and refresh tokens)
- Email verification using Nodemailer
- Secure token expiration & regeneration

---

## 🌍 Multi-language Support

- Integrated using `i18n`
- Language detected via `Accept-Language` header
- Language JSON files in `/locales`

---

## 📡 WebSocket + Redis

- Real-time communication using `socket.io`
- Scalable architecture using `socket.io-redis` adapter

---

## 📦 File Upload

- Supports:
  - Local file upload (development)
  - AWS S3 upload (production)

---

## 📊 Pagination

- Offset-based pagination (using `limit`, `page`)

---

## 🚀 Sequelize CLI Summary

```bash
# Generate migration
npx sequelize-cli migration:generate --name create_users_table

# Generate seeder
npx sequelize-cli seed:generate --name users

# DB operations
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 🧪 Testing

_TODO_: Add support for testing using Jest or Mocha.

---

## 📬 Postman Collection

You can use the following Postman collection to test all API endpoints:

👉 [Click to Open in Postman](https://api.postman.com/collections/26330367-5272dcb6-121f-4cf6-bcb6-8da503bee887?access_key=PMAT-01K1AGF6RH1N44S9RFDM2T41EB)

Make sure to:
- Set the environment variables like `{{base_url}}`, `{{access_token}}`, etc.
- Test user registration, login, email verification, file upload, and more.

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push the branch: `git push origin feature/awesome-feature`
5. Open a pull request

---
