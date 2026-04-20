const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bookRoutes = require('../src/routes/bookRoutes');
const Book = require('../src/models/Book');
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
app.use('/api/books', bookRoutes);
app.use(errorHandler);

describe('Book API Tests', () => {
  beforeEach(async () => {
    await Book.deleteMany({});

    // Seed test books
    await Book.insertMany([
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'A Handbook of Agile Software Craftsmanship',
        category: 'Programming',
        price: 45.99,
        discountedPrice: 35.99,
        rating: 4.8,
        coverImage: 'https://example.com/clean-code.jpg',
        pages: 464,
        isbn: '978-0132350884',
        isFeatured: true,
        isTrending: true,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'A fantasy adventure',
        category: 'Fiction',
        price: 25.00,
        discountedPrice: 18.00,
        rating: 4.8,
        coverImage: 'https://example.com/hobbit.jpg',
        pages: 310,
        isbn: '978-0547928227',
        isTrending: true,
      },
    ]);
  });

  describe('GET /api/books', () => {
    it('should get all books', async () => {
      const res = await request(app).get('/api/books');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books).toHaveLength(2);
      expect(res.body.pagination.total).toBe(2);
    });

    it('should filter books by category', async () => {
      const res = await request(app)
        .get('/api/books')
        .query({ category: 'Programming' });

      expect(res.status).toBe(200);
      expect(res.body.books).toHaveLength(1);
      expect(res.body.books[0].category).toBe('Programming');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/books')
        .query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.books).toHaveLength(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should get book by ID', async () => {
      const book = await Book.findOne({ title: 'Clean Code' });

      const res = await request(app).get(`/api/books/${book._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.book.title).toBe('Clean Code');
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/books/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/books/featured', () => {
    it('should get featured books', async () => {
      const res = await request(app).get('/api/books/featured');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
      expect(res.body.books[0].isFeatured).toBe(true);
    });
  });

  describe('GET /api/books/trending', () => {
    it('should get trending books', async () => {
      const res = await request(app).get('/api/books/trending');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
      expect(res.body.books[0].isTrending).toBe(true);
    });
  });

  describe('GET /api/books/categories', () => {
    it('should get all categories with count', async () => {
      const res = await request(app).get('/api/books/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.categories)).toBe(true);
      expect(res.body.categories[0]).toHaveProperty('category');
      expect(res.body.categories[0]).toHaveProperty('count');
    });
  });

  describe('GET /api/books/search', () => {
    it('should search books by query', async () => {
      const res = await request(app)
        .get('/api/books/search')
        .query({ q: 'Clean' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.results.length).toBeGreaterThan(0);
    });

    it('should reject search without query', async () => {
      const res = await request(app).get('/api/books/search');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('new book endpoints', () => {
    it('should return top rated books', async () => {
      const res = await request(app).get('/api/books/top-rated');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
      expect(res.body.books[0].rating).toBeGreaterThanOrEqual(3);
    });

    it('should return new arrivals', async () => {
      const res = await request(app).get('/api/books/new-arrivals');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
    });

    it('should return discounted books', async () => {
      const res = await request(app).get('/api/books/discounts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
      expect(res.body.books[0]).toHaveProperty('discountedPrice');
    });

    it('should return book stats', async () => {
      const res = await request(app).get('/api/books/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty('totalBooks');
      expect(res.body.stats.totalBooks).toBe(2);
    });
  });
});
