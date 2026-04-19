const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');
const { validateRequest, reviewSchema } = require('../middleware/validation');

/**
 * @route   GET /api/books/:bookId/reviews
 * @desc    Get reviews for a book
 * @access  Public
 */
router.get('/:bookId/reviews', reviewController.getBookReviews);

/**
 * @route   POST /api/books/:bookId/reviews
 * @desc    Create a review
 * @access  Private
 */
router.post('/:bookId/reviews', authMiddleware, validateRequest(reviewSchema), reviewController.createReview);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update review
 * @access  Private
 */
router.put('/:reviewId', authMiddleware, reviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete review
 * @access  Private
 */
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
