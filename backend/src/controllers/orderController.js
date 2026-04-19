const Order = require('../models/Order');
const Cart = require('../models/Cart');

/**
 * Create order from cart
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress, notes } = req.body;

    if (!paymentMethod || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and shipping address are required',
      });
    }

    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.book');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.priceAtAdding * item.quantity;
    });

    const finalAmount = totalAmount - (cart.discountAmount || 0);

    const order = new Order({
      user: req.user.userId,
      items: cart.items.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.priceAtAdding,
      })),
      totalAmount,
      discountAmount: cart.discountAmount || 0,
      finalAmount,
      paymentMethod,
      shippingAddress,
      notes,
      status: 'pending',
    });

    await order.save();

    // Clear cart after order creation
    await Cart.updateOne({ user: req.user.userId }, { items: [], discountAmount: 0 });

    await order.populate('items.book');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's orders
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user.userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.book')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate('items.book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (admin only)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled', 'refunded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'completed' && { completedAt: Date.now() }),
      },
      { new: true }
    ).populate('items.book');

    res.json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (admin only)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'email firstName lastName')
      .populate('items.book')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
