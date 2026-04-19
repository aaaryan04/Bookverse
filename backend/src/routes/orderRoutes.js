const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

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

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order status (admin only)
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (admin only)
 * @access  Private/Admin
 */
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);

module.exports = router;
