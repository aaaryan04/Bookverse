const Book = require('../models/Book');
const {
  getRecommendations,
  getTrendingBooks,
  getFeaturedBooks,
  getRelatedBooks,
  searchBooks,
} = require('../utils/recommendations');

/**
 * Get all books with pagination and filters
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, sortBy = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortBy);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
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
 * Get book by ID
 */
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search books
 */
exports.searchBooks = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, minRating } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
    };

    const results = await searchBooks(q, filters);

    res.json({
      success: true,
      results,
      count: results.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured books
 */
exports.getFeaturedBooks = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const books = await getFeaturedBooks(parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending books
 */
exports.getTrendingBooks = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const books = await getTrendingBooks(parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get related books
 */
exports.getRelatedBooks = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const books = await getRelatedBooks(req.params.id, parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new book (admin only)
 */
exports.createBook = async (req, res, next) => {
  try {
    const book = new Book(req.validatedData);
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update book (admin only)
 */
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.validatedData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete book (admin only)
 */
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Programming',
      'Business',
      'Self-Development',
      'Fiction',
      'Cybersecurity',
      'Psychology',
    ];

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => ({
        category,
        count: await Book.countDocuments({ category }),
      }))
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};
