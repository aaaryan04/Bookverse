const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateRequest, bookSchema } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

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
 * @route   GET /api/books/top-rated
 * @desc    Get top rated books
 * @access  Public
 */
router.get('/top-rated', bookController.getTopRatedBooks);

/**
 * @route   GET /api/books/new-arrivals
 * @desc    Get newest books by publication date
 * @access  Public
 */
router.get('/new-arrivals', bookController.getNewArrivals);

/**
 * @route   GET /api/books/discounts
 * @desc    Get discounted books
 * @access  Public
 */
router.get('/discounts', bookController.getDiscountedBooks);

/**
 * @route   GET /api/books/stats
 * @desc    Get book catalog statistics
 * @access  Public
 */
router.get('/stats', bookController.getBookStats);

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

module.exports = router;
