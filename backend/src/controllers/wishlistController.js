const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

/**
 * Get user's wishlist
 */
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.userId }).populate('books.book');

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.userId, books: [] });
      await wishlist.save();
    }

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add book to wishlist
 */
exports.addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.userId, books: [] });
    }

    // Check if book already in wishlist
    const exists = wishlist.books.some((item) => item.book.toString() === bookId);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist',
      });
    }

    wishlist.books.push({ book: bookId });
    await wishlist.save();
    await wishlist.populate('books.book');

    res.json({
      success: true,
      message: 'Book added to wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove book from wishlist
 */
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.books = wishlist.books.filter((item) => item.book.toString() !== bookId);
    await wishlist.save();
    await wishlist.populate('books.book');

    res.json({
      success: true,
      message: 'Book removed from wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if book is in wishlist
 */
exports.isInWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
      'books.book': bookId,
    });

    res.json({
      success: true,
      inWishlist: !!wishlist,
    });
  } catch (error) {
    next(error);
  }
};
