const Cart = require('../models/Cart');
const Book = require('../models/Book');

/**
 * Get user's cart
 */
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate('items.book');

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add book to cart
 */
exports.addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.validatedData;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Check if book already in cart
    const existingItem = cart.items.find((item) => item.book.toString() === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        book: bookId,
        quantity,
        priceAtAdding: book.discountedPrice || book.price,
      });
    }

    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      message: 'Book added to cart',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove book from cart
 */
exports.removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      message: 'Book removed from cart',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 */
exports.updateCartItem = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find((item) => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart',
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.book');

    res.json({
      success: true,
      message: 'Cart item updated',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 */
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { items: [], discountAmount: 0 },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    next(error);
  }
};
