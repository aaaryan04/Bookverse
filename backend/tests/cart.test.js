const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cartRoutes = require('../src/routes/cartRoutes');
const authRoutes = require('../src/routes/authRoutes');
const Cart = require('../src/models/Cart');
const Book = require('../src/models/Book');
const User = require('../src/models/User');
const errorHandler = require('../src/middleware/errorHandler');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use(errorHandler);

describe('Cart API Tests', () => {
  let token;
  let userId;
  let bookId;

  beforeEach(async () => {
    await Cart.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create user and get token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

    token = registerRes.body.token;
    userId = registerRes.body.user._id;

    // Create test book
    const book = await Book.create({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'A Handbook of Agile Software Craftsmanship',
      category: 'Programming',
      price: 45.99,
      discountedPrice: 35.99,
      coverImage: 'https://example.com/clean-code.jpg',
      pages: 464,
    });

    bookId = book._id;
  });

  describe('POST /api/cart', () => {
    it('should add book to cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.items).toHaveLength(1);
      expect(res.body.cart.items[0].quantity).toBe(1);
    });

    it('should increase quantity if book already in cart', async () => {
      // Add first time
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      // Add again
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.cart.items).toHaveLength(1);
      expect(res.body.cart.items[0].quantity).toBe(3);
    });

    it('should reject invalid book ID', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId: new mongoose.Types.ObjectId(),
          quantity: 1,
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/cart', () => {
    it('should get user cart', async () => {
      // Add to cart first
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.items).toHaveLength(1);
    });
  });

  describe('PUT /api/cart/:bookId', () => {
    it('should update cart item quantity', async () => {
      // Add to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      const res = await request(app)
        .put(`/api/cart/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body.cart.items[0].quantity).toBe(5);
    });

    it('should reject quantity less than 1', async () => {
      // Add to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      const res = await request(app)
        .put(`/api/cart/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cart/:bookId', () => {
    it('should remove book from cart', async () => {
      // Add to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      const res = await request(app)
        .delete(`/api/cart/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.cart.items).toHaveLength(0);
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear entire cart', async () => {
      // Add to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId,
          quantity: 1,
        });

      const res = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.cart.items).toHaveLength(0);
    });
  });
});
