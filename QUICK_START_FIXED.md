# BookStore Platform - Quick Start Guide

## Prerequisites
- Node.js (v14+) installed
- MongoDB Community Server installed and running locally
- npm installed

---

## Step 1: Start MongoDB (IMPORTANT!)

MongoDB must be running before starting the backend.

### Windows:
```powershell
# Open PowerShell and run:
mongod
```

**Or use MongoDB as a Service:**
- MongoDB is usually installed at: `C:\Program Files\MongoDB\Server\*\bin\mongod.exe`
- Open Services (services.msc) and make sure "MongoDB Server" is running

### macOS:
```bash
brew services start mongodb-community
```

### Linux:
```bash
sudo systemctl start mongod
```

---

## Step 2: Start the Backend

Open a **NEW terminal/PowerShell** and run:

```powershell
cd book-store-platform/backend
npm install
npm run seed
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected
Server running on port 10000
```

---

## Step 3: Start the Frontend

Open **ANOTHER terminal/PowerShell** and run:

```powershell
cd book-store-platform/frontend
npm install
npm start
```

**Expected:** Browser opens at `http://localhost:3000`

---

## Troubleshooting

### Error: "MongoDB Error: connect ECONNREFUSED"
- MongoDB is not running
- **Solution:** Run `mongod` in a new terminal first

### Error: "Cannot add to cart"
- Must be logged in
- **Solution:** Click "Sign Up" or "Login" first, create account, then add to cart

### Site loading forever
- Backend not running on port 5000
- **Solution:** Check that backend terminal shows "Server running on port 10000"

### Changes not reflecting
- Clear browser cache (Ctrl+Shift+Delete)
- Or use Incognito mode

---

## Frontend Features Fixed ✅
- ✅ 8-second timeout on API calls (no more hanging)
- ✅ Authentication check before cart/wishlist
- ✅ Error messages now show (not silent failures)
- ✅ Retry button on error screens

## Running Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** localhost:27017

---

## Test User Account
After seeding, use these credentials:
```
Email: user@example.com
Password: password123
```

---
