const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateRequest, bookSchema } = require('../middleware/validation');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/books
 * @desc    Get all books with pagination and filters
 * @access  Public
 */
router.get('/', bookController.getAllBooks);

/**
 * @route   GET /api/books/featured
 * @desc    Get featured books
 * @access  Public
 */
router.get('/featured', bookController.getFeaturedBooks);

/**
 * @route   GET /api/books/trending
 * @desc    Get trending books
 * @access  Public
 */
router.get('/trending', bookController.getTrendingBooks);

/**
 * @route   GET /api/books/search
 * @desc    Search books
 * @access  Public
 */
router.get('/search', bookController.searchBooks);

/**
 * @route   GET /api/books/categories
 * @desc    Get book categories
 * @access  Public
 */
router.get('/categories', bookController.getCategories);

/**
 * @route   GET /api/books/:id
 * @desc    Get book by ID
 * @access  Public
 */
router.get('/:id', bookController.getBook);

/**
 * @route   GET /api/books/:id/related
 * @desc    Get related books
 * @access  Public
 */
router.get('/:id/related', bookController.getRelatedBooks);

/**
 * @route   POST /api/books
 * @desc    Create a new book (admin only)
 * @access  Private/Admin
 */
router.post('/', authMiddleware, adminMiddleware, validateRequest(bookSchema), bookController.createBook);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book (admin only)
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, validateRequest(bookSchema), bookController.updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book (admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;
