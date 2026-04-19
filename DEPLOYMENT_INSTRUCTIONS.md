# 🚀 Complete Deployment Guide

## Prerequisites

### 1. Create Accounts (Required)

#### ✅ Heroku Account (Backend)
- Visit: https://signup.heroku.com
- Sign up for **free tier**
- Verify your email
- Add a payment method (free tier doesn't charge for basic apps)

#### ✅ Vercel Account (Frontend)
- Visit: https://vercel.com/signup
- Sign up with GitHub recommended
- Verify your email

#### ✅ MongoDB Atlas (Database)
- Visit: https://www.mongodb.com/cloud/atlas
- Create free account
- Create a free cluster
- Get connection string

---

## Part 1: Deploy Backend to Heroku

### Step 1: Create Heroku App

```bash
# Login to Heroku
heroku login

# Navigate to backend
cd backend

# Create app (replace MY-APP with unique name like "bookstore-api-12345")
heroku create MY-APP

# View created apps
heroku apps
```

**Example Output:**
```
Creating app MY-APP...
https://my-app-12345.herokuapp.com/ | https://git.heroku.com/my-app-12345.git
```

### Step 2: Add MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

### Step 3: Set Environment Variables on Heroku

```bash
# Navigate to backend folder
cd backend

# Set environment variables on Heroku
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://USER:PASS@cluster.mongodb.net/bookstore"
heroku config:set JWT_SECRET="your-super-secret-key-123456"
heroku config:set JWT_EXPIRE=7d
heroku config:set FRONTEND_URL="https://your-frontend-domain.vercel.app"

# Verify variables
heroku config
```

### Step 4: Deploy Backend

```bash
# Make sure you're in backend directory
cd backend

# Add to git
git add .
git commit -m "Backend initial deployment"

# Deploy to Heroku
git push heroku main

# View logs
heroku logs --tail

# If you get an error about main branch:
git push heroku HEAD:main
```

### Step 5: Seed Database

```bash
# Run seed script on Heroku
heroku run npm run seed

# Check if data was added
heroku run npm run db:check
```

**✅ Backend URL:** `https://YOUR-APP-NAME.herokuapp.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Push Frontend to GitHub

```bash
# Navigate to root project
cd ..

# Add all files
git add .

# Commit
git commit -m "Book store platform ready for deployment"

# Create repository on GitHub.com then:
git remote add origin https://github.com/YOUR-USERNAME/bookstore-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Vercel

```bash
# Option A: Using Vercel CLI
cd frontend
vercel login
vercel

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/dashboard
# 2. Click "New Project"
# 3. Select your GitHub repository
# 4. Configure project:
#    - Root Directory: frontend
#    - Build Command: npm run build
#    - Output Directory: build
# 5. Add environment variables:
#    - REACT_APP_API_URL: https://YOUR-APP-NAME.herokuapp.com/api
# 6. Click "Deploy"
```

### Step 3: Set Environment Variables on Vercel

```bash
# Using Vercel CLI
vercel env add REACT_APP_API_URL
# Enter: https://YOUR-HEROKU-APP.herokuapp.com/api

# Or in Vercel Dashboard:
# 1. Go to your project
# 2. Settings → Environment Variables
# 3. Add: REACT_APP_API_URL = https://YOUR-HEROKU-APP.herokuapp.com/api
# 4. Redeploy
```

**✅ Frontend URL:** `https://your-bookstore-vercel.vercel.app`

---

## Deployment URLs Template

Once deployed, you'll have these URLs:

```
BACKEND:  https://YOUR-HEROKU-APP.herokuapp.com
API:      https://YOUR-HEROKU-APP.herokuapp.com/api
FRONTEND: https://YOUR-BOOKSTORE.vercel.app

Update .env files with these URLs!
```

---

## Quick Command Reference

### Backend Deployment
```bash
cd backend

# Set environment variables
heroku config:set PORT=5000 NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_url"
heroku config:set JWT_SECRET="your_secret"
heroku config:set FRONTEND_URL="your_frontend_url"

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main

# Check status
heroku logs --tail
```

### Frontend Deployment
```bash
cd frontend

# Update .env.production
echo 'REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api' > .env.production

# Push to GitHub
git add .
git commit -m "Deploy frontend"
git push origin main

# Vercel auto-deploys on push to main!
```

---

## Test Deployed Application

### 1. Test Backend Health
```bash
curl https://YOUR-HEROKU-APP.herokuapp.com/health
# Should return: {"status":"OK"}
```

### 2. Get Books
```bash
curl https://YOUR-HEROKU-APP.herokuapp.com/api/books
# Should return list of books
```

### 3. Test User Registration
```bash
curl -X POST https://YOUR-HEROKU-APP.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"password123"
  }'
```

### 4. Visit Frontend
- Open: `https://YOUR-FRONTEND.vercel.app`
- Test registration and login
- Browse books
- Add to cart

---

## Environment Variables Checklist

### Backend (Heroku)
- [ ] PORT=5000
- [ ] NODE_ENV=production
- [ ] MONGODB_URI=mongodb+srv://...
- [ ] JWT_SECRET=your-secret-key
- [ ] JWT_EXPIRE=7d
- [ ] FRONTEND_URL=https://your-frontend.vercel.app

### Frontend (Vercel)
- [ ] REACT_APP_API_URL=https://your-heroku.herokuapp.com/api

---

## Troubleshooting

### Backend Won't Deploy

**Error: "Cannot find module"**
```bash
# Rebuild dependencies
heroku run npm install
heroku restart
```

**Error: "Cannot connect to MongoDB"**
```bash
# Check connection string
heroku config:get MONGODB_URI

# Verify on MongoDB Atlas:
# 1. Go to Network Access
# 2. Add 0.0.0.0/0 to allow all IPs
```

**Error: "Port already in use"**
```bash
# Heroku automatically assigns PORT - ensure code uses process.env.PORT
# Check server startup code
```

### Frontend Won't Deploy

**Error: "Build failed"**
```bash
# Check build logs in Vercel dashboard
# Ensure all dependencies in package.json
# Run locally: npm run build
```

**Error: "API calls failing from frontend"**
```bash
# Check REACT_APP_API_URL environment variable
# Verify backend CORS config has frontend URL
# Check browser console for exact error
```

### CORS Issues

```bash
# Update backend CORS config:
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
git push heroku main
```

---

## Monitoring Deployed Apps

### View Logs
```bash
# Backend logs
heroku logs --tail
heroku logs --app MY-APP --tail

# Frontend (in Vercel dashboard)
# Deployments → Select deployment → View logs
```

### Check Performance
- Frontend: https://vercel.com/dashboard → Your project → Analytics
- Backend: https://dashboard.heroku.com → Your app → Metrics

---

## Updating Deployed Apps

### Update Backend
```bash
cd backend
# Make changes to code
git add .
git commit -m "Bug fix: description"
git push heroku main
```

### Update Frontend
```bash
cd frontend
# Make changes to code
git add .
git commit -m "Feature: description"
git push origin main
# Vercel auto-redeploys!
```

---

## Production Checklist

- [ ] Create Heroku account
- [ ] Create Vercel account
- [ ] Create MongoDB Atlas cluster
- [ ] Deploy backend to Heroku
- [ ] Deploy frontend to Vercel
- [ ] Set all environment variables
- [ ] Run seed script
- [ ] Test health endpoint
- [ ] Test API endpoints with Postman
- [ ] Test frontend registration
- [ ] Test shopping flow
- [ ] Verify emails work
- [ ] Check error handling
- [ ] Monitor logs
- [ ] Set up monitoring/alerts

---

## Support Links

- Heroku: https://devcenter.heroku.com
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express: https://expressjs.com
- React: https://react.dev

---

## Next Steps

1. ✅ Create all accounts
2. ✅ Deploy backend
3. ✅ Deploy frontend
4. ✅ Test production
5. ✅ Monitor apps
6. ✅ Add custom domain (optional)
7. ✅ Enable HTTPS (automatic)
8. ✅ Set up backups
9. ✅ Add team members
10. ✅ Scale as needed

---

**Your application is ready for production deployment!** 🎉
