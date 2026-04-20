# Quick Reference Guide

## 🚀 30-Second Setup

### Backend
```bash
cd backend && npm install && cp .env.example .env
npm run seed && npm run dev
# Opens on http://localhost:5000
```

### Frontend
```bash
cd frontend && npm install && cp .env.example .env
npm start
# Opens on http://localhost:3000
```

---

## 🔑 Common Commands

### Development
```bash
# Backend - Start dev server
npm run dev

# Backend - Run tests
npm test

# Backend - Seed database
npm run seed

# Frontend - Start dev server
npm start

# Frontend - Build for production
npm build
```

### Database
```bash
# Connect to MongoDB locally
mongosh

# View collections
show collections

# View sample data
db.books.find()
db.users.find()
```

---

## 📱 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔗 Key API Endpoints

### Auth
```
POST   /api/auth/register      - Register user
POST   /api/auth/login         - Login user
GET    /api/auth/profile       - Get user profile
PUT    /api/auth/profile       - Update profile
```

### Books
```
GET    /api/books              - List all books
GET    /api/books/:id          - Get book details
GET    /api/books/search       - Search books
GET    /api/books/featured     - Featured books
GET    /api/books/trending     - Trending books
GET    /api/books/top-rated    - Top rated books
GET    /api/books/new-arrivals - New arrivals
GET    /api/books/discounts    - Discounted books
GET    /api/books/stats        - Book catalog statistics
GET    /api/books/categories   - Get categories
```

### Cart
```
GET    /api/cart               - Get cart
POST   /api/cart               - Add to cart
PUT    /api/cart/:bookId       - Update quantity
DELETE /api/cart/:bookId       - Remove item
DELETE /api/cart               - Clear cart
```

### Orders
```
POST   /api/orders             - Create order
GET    /api/orders             - Get user orders
GET    /api/orders/:id         - Get order details
```

### Reviews
```
GET    /api/books/:id/reviews  - Get reviews
POST   /api/books/:id/reviews  - Add review
PUT    /api/reviews/:id        - Update review
DELETE /api/reviews/:id        - Delete review
```

### Reading Progress
```
GET    /api/reading/:bookId    - Get progress
PUT    /api/reading/:bookId    - Update progress
POST   /api/reading/:id/bookmark    - Add bookmark
POST   /api/reading/:id/note        - Add note
```

### Wishlist
```
GET    /api/wishlist           - Get wishlist
POST   /api/wishlist/:bookId   - Add to wishlist
DELETE /api/wishlist/:bookId   - Remove from wishlist
```

---

## 🧪 Testing Examples

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Books
```bash
curl http://localhost:5000/api/books?page=1&limit=10
```

### Add to Cart (requires token)
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId":"BOOK_ID","quantity":1}'
```

---

## 🎨 Frontend File Structure

```
src/
├── pages/
│   ├── HomePage.jsx          - Homepage with featured/trending
│   ├── LoginPage.jsx         - User login
│   ├── RegisterPage.jsx      - User registration
│   └── CartPage.jsx          - Shopping cart
│
├── components/
│   ├── Header.jsx            - Navigation header
│   ├── BookCard.jsx          - Book display card
│   ├── PDFReader.jsx         - eBook reader
│   └── Footer.jsx            - Footer
│
├── context/
│   ├── AuthContext.jsx       - Authentication state
│   └── ThemeContext.jsx      - Dark/light theme
│
├── services/
│   └── api.js                - API client
│
├── styles/
│   └── index.css             - Global styles
│
├── App.jsx                   - Main app component
└── index.jsx                 - Entry point
```

---

## 📊 Backend File Structure

```
src/
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── readingProgressController.js
│   └── wishlistController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── readingProgressRoutes.js
│   └── wishlistRoutes.js
│
├── middleware/
│   ├── auth.js               - JWT verification
│   ├── validation.js         - Input validation
│   ├── rateLimit.js          - Rate limiting
│   └── errorHandler.js       - Error handling
│
├── models/
│   ├── User.js
│   ├── Book.js
│   ├── Order.js
│   ├── Review.js
│   ├── ReadingProgress.js
│   ├── Cart.js
│   └── Wishlist.js
│
├── utils/
│   ├── jwt.js                - Token utilities
│   └── recommendations.js    - Recommendation engine
│
├── config/
│   └── database.js           - MongoDB connection
│
├── scripts/
│   └── seedDatabase.js       - Sample data
│
└── index.js                  - Server entry
```

---

## 🔐 Authentication Flow

1. **Register**: POST `/api/auth/register` → Create user → Return JWT
2. **Login**: POST `/api/auth/login` → Verify credentials → Return JWT
3. **Store Token**: Save JWT in localStorage
4. **Make Requests**: Include `Authorization: Bearer <token>` header
5. **Verify Token**: Backend middleware validates token
6. **Authorize**: Check access for protected routes

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
Solution: 
  - Ensure MongoDB is running
  - Check MONGODB_URI in .env
  - For Atlas: Update IP whitelist
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution:
  - Check CORS config in backend
  - Verify FRONTEND_URL in .env
  - Browser network tab shows exact error
```

### JWT Token Expired
```
Error: Token expired
Solution:
  - Login again
  - Token stored in localStorage will be cleared
  - New login generates fresh token
```

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
Solution (macOS/Linux):
  lsof -ti:5000 | xargs kill -9
Solution (Windows):
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
```

---

## 📈 Performance Tips

### Frontend
- Use React DevTools Profiler to find slow components
- Check Network tab for slow API calls
- Use Lighthouse for performance audit
- Enable compression in production

### Backend
- Check MongoDB query performance with `explain()`
- Use database indexes (already set up)
- Enable response compression
- Implement caching for featured/trending
- Use connection pooling

---

## 🧠 Code Style Guide

### JavaScript
```javascript
// Use const/let (not var)
const user = {};

// Use arrow functions
const handleClick = () => {};

// Use async/await
const fetchData = async () => {
  const data = await api.get('/endpoint');
};

// Use destructuring
const { name, email } = user;
```

### React
```jsx
// Use functional components
const MyComponent = () => {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Effect
  }, []);
  
  return <div>Content</div>;
};

// Use PropTypes or TypeScript
MyComponent.propTypes = {
  title: PropTypes.string.required,
};
```

### Express
```javascript
// Use async/await in routes
router.get('/endpoint', async (req, res, next) => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
```

---

## 📚 Useful Resources

### Documentation
- [Express.js](https://expressjs.com)
- [MongoDB](https://docs.mongodb.com)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT.io](https://jwt.io)

### Tools
- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [React DevTools](https://react-devtools-tutorial.vercel.app/) - Debug React
- [VS Code](https://code.visualstudio.com) - Code editor

---

## 🎯 Checklist Before Deployment

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS with specific frontend URL
- [ ] Test all API endpoints
- [ ] Run test suite (npm test)
- [ ] Check error handling
- [ ] Configure MongoDB Atlas
- [ ] Set NODE_ENV=production
- [ ] Test payment flow (when implemented)
- [ ] Check rate limiting
- [ ] Test dark/light mode
- [ ] Verify responsive design on mobile
- [ ] Check console for errors
- [ ] Test authentication flow
- [ ] Verify token expiration
- [ ] Test wishlist features
- [ ] Verify search functionality

---

## 🚀 Deployment Checklist

- [ ] Deploy backend to Heroku
- [ ] Deploy frontend to Vercel
- [ ] Set environment variables on hosting
- [ ] Test endpoints from production URLs
- [ ] Set up error tracking (Sentry)
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure CDN for assets
- [ ] Test database backups
- [ ] Enable logging

---

**Ready to develop? Start with the backend setup and test the API endpoints first!**
