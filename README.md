# 📚 Book Store Platform

A modern ** Book Store & eBook platform** built with a scalable architecture.
Users can browse books, manage carts, and interact with a dynamic backend API.

---

## 🚀 Features

* 📖 Browse and search books
* 🛒 Add to cart & manage orders
* 🔐 Authentication system (JWT-based)
* ⚡ Fast React frontend
* 🌐 REST API backend (Node.js + Express)
* 🗄️ MongoDB database integration

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Axios
* CSS / Tailwind (if used)

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## ⚙️ Getting Started

### 📌 Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* MongoDB (Local or Atlas)

---

## 🔧 Backend Setup

1. Navigate to backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   ```

4. Run backend server:

   ```bash
   npm run dev
   ```

👉 Backend runs on: **http://localhost:5000**

---

## 🎨 Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start frontend:

   ```bash
   npm start
   ```

👉 Frontend runs on: **http://localhost:3000**

---

## 🌍 Deployment

* Frontend → Vercel
* Backend → Render / Railway / Heroku

⚠️ Make sure to update environment variables in deployment platforms.

---

## 📦 Project Structure

```
book-store-platform/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│
└── README.md
```

---

## 📌 Important Notes

* Run seed script to populate sample data (if available)
* Ensure backend is running before frontend
* Update API URL in production

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📄 License

MIT License © 2026

---

## 💡 Author

**Aryan Swarnkar**
GitHub: https://github.com/aaaryan04

---
