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
    const { page = 1, limit = 12, category, sortBy = '-createdAt', isFree } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) {
      query.category = category;
    }
    if (isFree === 'true') {
      query.isFree = true;
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
    const { q, category, minPrice, maxPrice, minRating, page = 1, limit = 12 } = req.query;

    // Validate search query
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Build filters object
    const filters = {
      category: category || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      page: parseInt(page) - 1, // Convert to 0-indexed
      limit: parseInt(limit),
    };

    // Perform search
    const results = await searchBooks(q, filters);

    // For now, get total count (optimizable in future)
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = new RegExp(escapedQuery, 'i');
    
    const totalCountQuery = {
      $or: [
        { title: regexPattern },
        { author: regexPattern },
        { description: regexPattern },
        { tags: { $regex: escapedQuery, $options: 'i' } },
      ],
    };

    if (filters.category && filters.category !== 'all') {
      totalCountQuery.category = filters.category;
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      const minPrice = parseFloat(filters.minPrice);
      const maxPrice = parseFloat(filters.maxPrice);
      
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        totalCountQuery.price = {
          $gte: minPrice,
          $lte: maxPrice,
        };
      }
    }

    if (filters.minRating !== undefined) {
      const minRating = parseFloat(filters.minRating);
      if (!isNaN(minRating) && minRating > 0) {
        totalCountQuery.rating = { $gte: minRating };
      }
    }

    const totalCount = await Book.countDocuments(totalCountQuery);

    res.json({
      success: true,
      results,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
      count: results.length,
    });
  } catch (error) {
    console.error('Search controller error:', error);
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
 * Get categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]);

    res.json({
      success: true,
      categories: categories.map(({ _id, count }) => ({ category: _id, count })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top rated books
 */
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.find({ rating: { $gte: 3 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get new arrivals
 */
exports.getNewArrivals = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.find()
      .sort({ publicationDate: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get discounted books
 */
exports.getDiscountedBooks = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.find({ discountedPrice: { $exists: true, $ne: null } })
      .sort({ discountedPrice: 1, rating: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get book catalog stats
 */
exports.getBookStats = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const categories = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
    ]);
    const topCategories = categories.slice(0, 5);
    const newestBooks = await Book.find()
      .sort({ publicationDate: -1 })
      .limit(5)
      .select('title author publicationDate');

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalCategories: categories.length,
        topCategories,
        newestBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};
