# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │
│  │  React Frontend  │  │  Theme Context   │  │  Auth Ctx   │   │
│  │  (React Router)  │  │  (Dark/Light)    │  │  (JWT)      │   │
│  └────────┬─────────┘  └──────────────────┘  └─────────────┘   │
│           │                                                      │
│           └──────────────────────┬─────────────────────────────┘
│                                  │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
                        HTTPS / TLS / CORS
                                   │
┌──────────────────────────────────┼──────────────────────────────┐
│                     API Gateway Layer                           │
├──────────────────────────────────┼──────────────────────────────┤
│                                  │                              │
│  Rate Limiting │ CORS │ Auth Middleware │ Error Handler        │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────┐
│                    Application Layer (Express)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Routes     │  │ Controllers  │  │   Middleware       │    │
│  │              │  │              │  │   - Auth           │    │
│  │ /api/auth    │──│ authController   │   - Validation     │    │
│  │ /api/books   │──│ bookController   │   - Error Handler  │    │
│  │ /api/cart    │──│ cartController   │                    │    │
│  │ /api/orders  │──│ orderController  │                    │    │
│  │ /api/reviews │──│ reviewController │                    │    │
│  │ /api/reading │──│ progressController                    │    │
│  │ /api/wishlist│──│ wishlistController                    │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
                    Business Logic
                           │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (Models)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User │ Book │ Order │ Review │ Cart │ ReadingProgress │ Wishlist │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
                    Database Driver
                           │
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections:                                                    │
│  - users              - orders                                   │
│  - books              - reviews                                  │
│  - carts              - readingprogress                          │
│  - wishlists                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### User Registration Flow
```
1. User fills registration form
   ↓
2. Frontend validates input
   ↓
3. POST /api/auth/register
   ↓
4. Backend validates with Joi schema
   ↓
5. Check if email exists
   ↓
6. Hash password with bcrypt
   ↓
7. Create user document in MongoDB
   ↓
8. Generate JWT token
   ↓
9. Return token + user data
   ↓
10. Frontend stores token in localStorage
   ↓
11. Redirect to homepage
```

### Add to Cart Flow
```
1. User clicks "Add to Cart" button
   ↓
2. Frontend calls cartAPI.addToCart(bookId, quantity)
   ↓
3. Frontend adds Authorization header with JWT
   ↓
4. Backend authMiddleware validates token
   ↓
5. Extract userId from token
   ↓
6. Verify book exists
   ↓
7. Find or create user's cart
   ↓
8. Add/update item in cart
   ↓
9. Return updated cart
   ↓
10. Frontend updates UI
    ↓
11. Show success toast notification
```

### Recommendation Flow
```
1. User visits homepage
   ↓
2. Frontend calls bookAPI.getFeaturedBooks()
   ↓
3. Backend queries Book collection for featured=true
   ↓
4. Sort by rating and reviewCount
   ↓
5. Limit to 6 books
   ↓
6. Return to frontend
   ↓
7. Frontend renders BookCard components
   ↓
8. Display featured books section
```

## 🔐 Authentication & Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Credentials → POST /api/auth/login                     │
│  2. Validate credentials against bcrypt hash                    │
│  3. Generate JWT token with user ID and role                    │
│  4. Token expires in 7 days (configurable)                      │
│  5. Frontend stores token in localStorage                       │
│  6. All subsequent requests include Authorization header        │
│  7. Backend authMiddleware extracts and verifies token          │
│  8. Attach user data to request object                          │
│  9. Controller accesses req.user for authorization checks       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Security Layers:
├─ Rate Limiting (prevent brute force)
├─ Input Validation (Joi schemas)
├─ Password Hashing (bcrypt)
├─ JWT Tokens (stateless auth)
├─ CORS (cross-origin control)
├─ Error Handling (no sensitive data leaks)
└─ Role-Based Access Control (user vs admin)
```

## 🗄️ Database Schema Relationships

```
User (1) ───────── (Many) Order
  │                        │
  ├─────────────────────── ReviewCount
  │                        │
  ├─────────────── Cart (1:1)
  │
  ├─────────────── ReadingProgress (Many)
  │                        │
  │                        └─ Book (Many)
  │
  └─────────────── Wishlist (1:1)
                           │
                           └─ Book (Many)

Book (1) ───────── (Many) Review
  │                        │
  ├─────────────────────── Comment
  │
  ├─────────────── Order Items (Many)
  │
  └─────────────── ReadingProgress (Many)

Order (1) ───────── (Many) OrderItems
              │
              └─ Book
```

## 🔄 API Request/Response Cycle

```
Client Request
    ↓
[CORS Middleware]
    ↓
[Rate Limiter]
    ↓
[Parser (JSON)]
    ↓
[Auth Middleware] (if protected route)
    ├─ Extract JWT token
    ├─ Verify signature
    ├─ Check expiration
    └─ Set req.user
    ↓
[Validation Middleware] (if specified)
    ├─ Validate request body
    └─ Set req.validatedData
    ↓
[Route Handler]
    ↓
[Controller Function]
    ├─ Business logic
    ├─ Database queries
    └─ Return response
    ↓
[Response Formatting]
    ├─ Status code
    ├─ Success/error flag
    └─ Data payload
    ↓
Client Response
```

## 📈 Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    │
    ├─ Backend Server 1 (Port 5000)
    ├─ Backend Server 2 (Port 5000)
    └─ Backend Server 3 (Port 5000)
         │
         └─ MongoDB Replica Set
              ├─ Primary
              ├─ Secondary
              └─ Secondary
```

### Caching Strategy
```
L1 Cache: Redis (in-memory)
    ├─ Featured books (1 hour)
    ├─ Trending books (1 hour)
    └─ Categories (24 hours)

L2 Cache: CDN (static assets)
    ├─ Book covers
    ├─ Frontend assets
    └─ PDF files
```

### Database Optimization
```
Indexes:
├─ users.email (unique)
├─ books.category
├─ books.isFeatured
├─ books.isTrending
├─ orders.user
├─ orders.status
├─ reviews.book
├─ reviews.createdAt
└─ readingprogress.user + readingprogress.book (unique)

Text Indexes:
├─ books (full-text search on title, author, description)
```

## 🚀 Performance Optimization

### Frontend
- **Code Splitting**: Load only required components
- **Lazy Loading**: Load images only when visible
- **Caching**: Service workers for offline support
- **Minification**: Production builds compressed
- **Lazy Images**: Use placeholder before loading

### Backend
- **Query Optimization**: Select only needed fields
- **Pagination**: Limit results to prevent timeout
- **Compression**: Gzip on responses
- **Connection Pooling**: MongoDB connection pooling
- **Async Processing**: Background jobs for heavy tasks

## 📊 Monitoring & Logging

```
Application Logs → Log Aggregation Service (e.g., ELK Stack)
                           ↓
                   ┌─────────┴──────────┐
                   ↓                    ↓
            Metrics Dashboard    Error Tracking
            (e.g., Grafana)     (e.g., Sentry)
                   │                    │
                   └─────────┬──────────┘
                             ↓
                      Alert System
                    (Slack/Email)
```

## 🔧 Deployment Architecture

### Production Deployment
```
GitHub Repository
    ↓
CI/CD Pipeline (GitHub Actions)
    ├─ Run Tests
    ├─ Build Docker image
    └─ Deploy to Heroku/AWS
         ↓
    ┌────────────────────────┐
    │   Production Server    │
    │  (Node.js + Express)   │
    └────────────────────────┘
         ↓
    ┌────────────────────────┐
    │  MongoDB Atlas         │
    │  (Cloud Database)      │
    └────────────────────────┘
         ↓
    ┌────────────────────────┐
    │  CDN (CloudFront)      │
    │  (Static Assets)       │
    └────────────────────────┘
```

---

**This architecture supports thousands of concurrent users and millions of books efficiently.**
