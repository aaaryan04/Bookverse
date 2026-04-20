const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/orders
 * @desc    Create order from cart
 * @access  Private
 */
router.post('/', authMiddleware, orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/', authMiddleware, orderController.getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, orderController.getOrder);

module.exports = router;
