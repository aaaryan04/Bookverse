const express = require('express');
const router = express.Router();
const readingProgressController = require('../controllers/readingProgressController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/reading/:bookId
 * @desc    Get reading progress for a book
 * @access  Private
 */
router.get('/:bookId', authMiddleware, readingProgressController.getReadingProgress);

/**
 * @route   GET /api/reading
 * @desc    Get all reading progress for user
 * @access  Private
 */
router.get('/', authMiddleware, readingProgressController.getUserReadingProgress);

/**
 * @route   POST /api/reading/:bookId/start
 * @desc    Start reading a book
 * @access  Private
 */
router.post('/:bookId/start', authMiddleware, readingProgressController.startReading);

/**
 * @route   POST /api/reading/enroll/:bookId
 * @desc    Enroll in a free book
 * @access  Private
 */
router.post('/enroll/:bookId', authMiddleware, readingProgressController.enrollInBook);

/**
 * @route   PUT /api/reading/:bookId
 * @desc    Update reading progress
 * @access  Private
 */
router.put('/:bookId', authMiddleware, readingProgressController.updateReadingProgress);

/**
 * @route   POST /api/reading/:bookId/bookmark
 * @desc    Add bookmark
 * @access  Private
 */
router.post('/:bookId/bookmark', authMiddleware, readingProgressController.addBookmark);

/**
 * @route   POST /api/reading/:bookId/note
 * @desc    Add note
 * @access  Private
 */
router.post('/:bookId/note', authMiddleware, readingProgressController.addNote);

module.exports = router;
