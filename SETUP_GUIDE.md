# Setup & Deployment Guide

## ⚡ Quick Start

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd book-store-platform
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# For local development:
# MONGODB_URI=mongodb://localhost:27017/bookstore
# PORT=5000
# JWT_SECRET=your_secret_key

# Seed database with sample books
npm run seed

# Start development server
npm run dev
```

Server runs on: `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

App opens on: `http://localhost:3000`

## 🧪 Testing

### Run All Tests
```bash
cd backend
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## 🚀 Production Deployment

### Backend Deployment (Heroku)

1. **Create Heroku Account** at https://www.heroku.com

2. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create Heroku App**
   ```bash
   cd backend
   heroku create book-store-api
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_production_secret
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=your_frontend_url
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Check Logs**
   ```bash
   heroku logs --tail
   ```

### Frontend Deployment (Vercel)

1. **Create Vercel Account** at https://vercel.com

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment**
   - Set `REACT_APP_API_URL` to your backend URL in Vercel dashboard

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account** at https://www.mongodb.com/cloud/atlas

2. **Create Free Cluster**
   - Select region
   - Choose M0 (free tier)
   - Create cluster

3. **Create Database User**
   - Go to Database Access
   - Create user with strong password
   - Note the credentials

4. **Create IP Whitelist**
   - Go to Network Access
   - Allow access from anywhere (0.0.0.0/0) for development
   - For production, add specific IPs

5. **Get Connection String**
   - Go to Clusters
   - Click "Connect"
   - Copy connection string
   - Replace `<username>` and `<password>` with your credentials

6. **Update MONGODB_URI**
   ```bash
   # Local
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore

   # Production (on Heroku)
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
   ```

## 📋 Production Checklist

### Before Going Live

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly (set specific frontend URL)
- [ ] Set up MongoDB Atlas with production settings
- [ ] Enable SSL/TLS
- [ ] Set NODE_ENV=production
- [ ] Configure rate limiting appropriately
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Enable HTTPS
- [ ] Set secure cookies
- [ ] Configure CDN for assets
- [ ] Set up backup strategy
- [ ] Enable monitoring

### Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use strong random secrets
   - Rotate secrets regularly

2. **Database**
   - Use strong credentials
   - Enable encryption at rest
   - Regular backups
   - Connection pooling

3. **API**
   - Rate limiting
   - Input validation
   - CORS restrictions
   - HTTPS only

4. **Frontend**
   - Content Security Policy
   - HTTPS redirects
   - Secure cookies
   - XSS protection

## 📊 Monitoring

### Set Up Error Tracking (Sentry)

1. **Create Sentry Account** at https://sentry.io

2. **Install Sentry SDK**
   ```bash
   # Backend
   npm install @sentry/node @sentry/tracing
   
   # Frontend
   npm install @sentry/react @sentry/tracing
   ```

3. **Configure in Code**
   ```javascript
   // Backend
   const Sentry = require("@sentry/node");
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   
   // Frontend
   import * as Sentry from "@sentry/react";
   Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Test Backend
        run: |
          cd backend
          npm install
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "book-store-api"
          usedocker: false
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## 📱 Performance Optimization

### Backend Optimization
- Enable gzip compression
- Implement caching headers
- Use database indexing
- Implement pagination
- Rate limiting

### Frontend Optimization
- Code splitting
- Lazy loading images
- Minification
- Asset optimization
- Service workers

## 🆘 Troubleshooting

### Backend Issues

**Cannot connect to MongoDB**
```bash
# Check connection string
# Verify credentials
# Check IP whitelist on MongoDB Atlas
# Test connection with mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/bookstore"
```

**Port already in use**
```bash
# Kill process on port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Issues

**API calls not working**
- Check REACT_APP_API_URL in .env
- Verify backend is running
- Check CORS configuration
- Check browser console for errors

**Dark mode not working**
- Clear localStorage
- Check theme context
- Verify CSS classes

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Introduction](https://jwt.io/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Need help?** Check the main README.md for API documentation and features list.
