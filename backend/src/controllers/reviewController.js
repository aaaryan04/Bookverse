const Review = require('../models/Review');
const Book = require('../models/Book');

/**
 * Get reviews for a book
 */
exports.getBookReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'firstName lastName avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortBy);

    const total = await Review.countDocuments({ book: req.params.bookId });

    res.json({
      success: true,
      reviews,
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
 * Create a review
 */
exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, content } = req.validatedData;
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: req.user.userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book',
      });
    }

    const review = new Review({
      book: bookId,
      user: req.user.userId,
      rating,
      title,
      content,
    });

    await review.save();
    await review.populate('user', 'firstName lastName avatar');

    // Update book rating
    const reviews = await Review.find({ book: bookId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update review
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, title, content } = req.body;

    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.content = content || review.content;

    await review.save();
    await review.populate('user', 'firstName lastName avatar');

    // Update book rating
    const reviews = await Review.find({ book: review.book });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(review.book, {
      rating: Math.round(averageRating * 10) / 10,
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Update book rating
    const reviews = await Review.find({ book: review.book });
    let averageRating = 0;

    if (reviews.length > 0) {
      averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }

    await Book.findByIdAndUpdate(review.book, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
