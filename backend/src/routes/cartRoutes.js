const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');
const { validateRequest, addToCartSchema } = require('../middleware/validation');

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', authMiddleware, cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add book to cart
 * @access  Private
 */
router.post('/', authMiddleware, validateRequest(addToCartSchema), cartController.addToCart);

/**
 * @route   DELETE /api/cart/:bookId
 * @desc    Remove book from cart
 * @access  Private
 */
router.delete('/:bookId', authMiddleware, cartController.removeFromCart);

/**
 * @route   PUT /api/cart/:bookId
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/:bookId', authMiddleware, cartController.updateCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private
 */
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
