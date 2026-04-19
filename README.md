# Smart Online Book Store + eBook Platform

A modern, production-ready full-stack application for browsing, purchasing, and reading eBooks with intelligent recommendations.

## 🌟 Features

### 📚 Core Features
- **Book Browsing**: Browse thousands of books by category
- **Search & Filter**: Full-text search with category and price filters
- **Shopping Cart**: Add books to cart and manage quantities
- **Secure Checkout**: Complete order process with shipping details
- **eBook Reader**: Built-in PDF viewer with bookmarks and notes
- **Reading Progress**: Track reading progress with page markers
- **User Reviews**: Rate and review books
- **Wishlist**: Save favorite books for later

### 🤖 Intelligence Features
- **Personalized Recommendations**: Based on reading history
- **Trending Books**: Auto-updated trending section
- **Featured Books**: Admin-curated featured books
- **Related Books**: Similar books by category

### 🔐 Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt password encryption
- **Rate Limiting**: API rate limiting to prevent abuse
- **Role-Based Access**: Admin and user roles
- **Input Validation**: Joi schema validation

### 🎨 UI/UX Features
- **Responsive Design**: Works on desktop, tablet, mobile
- **Dark Mode**: Built-in dark/light theme toggle
- **Modern Interface**: Amazon/Kindle-like premium design
- **Smooth Animations**: Polished user experience

## 📁 Project Structure

```
book-store-platform/
├── frontend/                      # React/Next.js frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── components/           # Reusable components
│   │   ├── context/              # React context (Auth, Theme)
│   │   ├── services/             # API services
│   │   ├── styles/               # Tailwind CSS
│   │   ├── hooks/                # Custom hooks
│   │   ├── App.jsx               # Main app component
│   │   └── index.jsx             # Entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── backend/                       # Node.js/Express backend
    ├── src/
    │   ├── controllers/          # Business logic
    │   ├── routes/               # API routes
    │   ├── middleware/           # Custom middleware
    │   ├── models/               # MongoDB schemas
    │   ├── utils/                # Utility functions
    │   ├── config/               # Configuration
    │   ├── scripts/              # Seed scripts
    │   └── index.js              # Server entry point
    ├── tests/                    # Jest tests
    ├── package.json
    ├── jest.config.js
    ├── .env.example
    └── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env variables**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   App will open on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { ... }
}
```

### Books Endpoints

#### Get All Books
```
GET /api/books?page=1&limit=12&category=Programming&sortBy=-createdAt

Response:
{
  "success": true,
  "books": [...],
  "pagination": { ... }
}
```

#### Get Book Details
```
GET /api/books/{bookId}

Response:
{
  "success": true,
  "book": { ... }
}
```

#### Search Books
```
GET /api/books/search?q=clean&category=Programming&minPrice=20&maxPrice=50

Response:
{
  "success": true,
  "results": [...],
  "count": 5
}
```

#### Get Featured Books
```
GET /api/books/featured?limit=6

Response:
{
  "success": true,
  "books": [...]
}
```

#### Get Trending Books
```
GET /api/books/trending?limit=6

Response:
{
  "success": true,
  "books": [...]
}
```

#### Get Categories
```
GET /api/books/categories

Response:
{
  "success": true,
  "categories": [
    { "category": "Programming", "count": 15 },
    ...
  ]
}
```

### Cart Endpoints

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>

Response:
{
  "success": true,
  "cart": { items: [...], discountAmount: 0 }
}
```

#### Add to Cart
```
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "bookIdHere",
  "quantity": 1
}

Response:
{
  "success": true,
  "message": "Book added to cart",
  "cart": { ... }
}
```

#### Update Cart Item
```
PUT /api/cart/{bookId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}

Response:
{
  "success": true,
  "cart": { ... }
}
```

#### Remove from Cart
```
DELETE /api/cart/{bookId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "cart": { ... }
}
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "credit_card",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}

Response:
{
  "success": true,
  "order": { ... }
}
```

#### Get User Orders
```
GET /api/orders?page=1&limit=10&status=completed
Authorization: Bearer <token>

Response:
{
  "success": true,
  "orders": [...],
  "pagination": { ... }
}
```

### Review Endpoints

#### Get Book Reviews
```
GET /api/books/{bookId}/reviews?page=1&limit=10&sortBy=-createdAt

Response:
{
  "success": true,
  "reviews": [...],
  "pagination": { ... }
}
```

#### Create Review
```
POST /api/books/{bookId}/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Amazing Book!",
  "content": "This book changed my perspective on..."
}

Response:
{
  "success": true,
  "review": { ... }
}
```

### Reading Progress Endpoints

#### Get Reading Progress
```
GET /api/reading/{bookId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "progress": { ... }
}
```

#### Update Reading Progress
```
PUT /api/reading/{bookId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPage": 150,
  "status": "reading"
}

Response:
{
  "success": true,
  "progress": { ... }
}
```

#### Add Bookmark
```
POST /api/reading/{bookId}/bookmark
Authorization: Bearer <token>
Content-Type: application/json

{
  "page": 50,
  "note": "Important passage"
}

Response:
{
  "success": true,
  "progress": { ... }
}
```

### Wishlist Endpoints

#### Get Wishlist
```
GET /api/wishlist
Authorization: Bearer <token>

Response:
{
  "success": true,
  "wishlist": { ... }
}
```

#### Add to Wishlist
```
POST /api/wishlist/{bookId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "wishlist": { ... }
}
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
Tests cover:
- Authentication (register, login, profile)
- Book operations (list, search, filter)
- Cart operations (add, update, remove)
- All edge cases and error scenarios

## 🔒 Security

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Joi schema validation on all inputs
- **CORS**: Cross-Origin Resource Sharing configured
- **Middleware**: Custom auth and error handling middleware

## 📦 Deployment

### Deploy Backend (Heroku)
```bash
# Install Heroku CLI
heroku create book-store-api
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

### Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
vercel
# Follow prompts
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **pdfjs-dist**: PDF viewer
- **React Icons**: Icon library
- **React Toastify**: Notifications

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Joi**: Validation
- **Jest**: Testing
- **Supertest**: HTTP testing

## 📋 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: "user" | "admin",
  preferences: {
    favoriteCategories: [String],
    darkMode: Boolean,
    emailNotifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  description: String,
  category: String,
  price: Number,
  discountedPrice: Number,
  rating: Number,
  reviewCount: Number,
  coverImage: String,
  pdfUrl: String,
  pages: Number,
  isFeatured: Boolean,
  isTrending: Boolean,
  createdAt: Date
}
```

## 🎯 Features to Implement

Already Implemented:
- ✅ User authentication
- ✅ Book management
- ✅ Shopping cart
- ✅ Orders
- ✅ Reviews
- ✅ Reading progress
- ✅ Wishlist
- ✅ Search & filters
- ✅ Recommendations

Future Enhancements:
- 📋 Payment integration (Stripe)
- 📧 Email notifications
- 💬 Real-time chat support
- 📊 Analytics dashboard
- 🎭 Social features
- 📱 Mobile app
- 🔊 Audiobook support

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 📄 License

MIT License - feel free to use this project!

---

**Built with ❤️ by Your Development Team**
