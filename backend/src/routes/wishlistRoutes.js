const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', authMiddleware, wishlistController.getWishlist);

/**
 * @route   POST /api/wishlist/:bookId
 * @desc    Add book to wishlist
 * @access  Private
 */
router.post('/:bookId', authMiddleware, wishlistController.addToWishlist);

/**
 * @route   DELETE /api/wishlist/:bookId
 * @desc    Remove book from wishlist
 * @access  Private
 */
router.delete('/:bookId', authMiddleware, wishlistController.removeFromWishlist);

/**
 * @route   GET /api/wishlist/:bookId
 * @desc    Check if book is in wishlist
 * @access  Private
 */
router.get('/:bookId', authMiddleware, wishlistController.isInWishlist);

module.exports = router;
