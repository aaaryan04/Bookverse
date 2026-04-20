const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboardStats);

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get('/orders', authMiddleware, adminMiddleware, adminController.getAllOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get order by ID
 * @access  Private/Admin
 */
router.get('/orders/:id', authMiddleware, adminMiddleware, adminController.getOrderById);

/**
 * @route   PUT /api/admin/orders/:id
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/orders/:id', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

/**
 * @route   GET /api/admin/books
 * @desc    Get all books (for admin)
 * @access  Private/Admin
 */
router.get('/books', authMiddleware, adminMiddleware, adminController.getAllBooksAdmin);

module.exports = router;
