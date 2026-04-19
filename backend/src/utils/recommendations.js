const Book = require('../models/Book');
const ReadingProgress = require('../models/ReadingProgress');
const Review = require('../models/Review');

/**
 * Get personalized book recommendations
 * Based on user's reading history and category preferences
 */
const getRecommendations = async (userId, limit = 6) => {
  try {
    // Get user's reading progress
    const userReadingHistory = await ReadingProgress.find({ user: userId }).populate('book');

    // Get favorite categories from reading history
    const favoriteCategories = [...new Set(userReadingHistory.map((r) => r.book.category))];

    // Get recommended books (featured or from favorite categories)
    const recommendations = await Book.find({
      $or: [
        { category: { $in: favoriteCategories } },
        { isTrending: true },
        { isFeatured: true },
      ],
      _id: {
        $nin: userReadingHistory.map((r) => r.book._id),
      },
    })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

/**
 * Get trending books
 */
const getTrendingBooks = async (limit = 6) => {
  try {
    const trendingBooks = await Book.find({ isTrending: true })
      .sort({ rating: -1 })
      .limit(limit);

    return trendingBooks;
  } catch (error) {
    console.error('Trending books error:', error);
    return [];
  }
};

/**
 * Get featured books
 */
const getFeaturedBooks = async (limit = 6) => {
  try {
    const featuredBooks = await Book.find({ isFeatured: true }).limit(limit);

    return featuredBooks;
  } catch (error) {
    console.error('Featured books error:', error);
    return [];
  }
};

/**
 * Get related books (similar category)
 */
const getRelatedBooks = async (bookId, limit = 5) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) return [];

    const relatedBooks = await Book.find({
      category: book.category,
      _id: { $ne: bookId },
    })
      .limit(limit);

    return relatedBooks;
  } catch (error) {
    console.error('Related books error:', error);
    return [];
  }
};

/**
 * Search books with full-text search
 */
const searchBooks = async (query, filters = {}) => {
  try {
    const searchQuery = {
      $text: { $search: query },
    };

    if (filters.category) {
      searchQuery.category = filters.category;
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      searchQuery.price = {
        $gte: filters.minPrice,
        $lte: filters.maxPrice,
      };
    }

    if (filters.minRating !== undefined) {
      searchQuery.rating = { $gte: filters.minRating };
    }

    const results = await Book.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .limit(50);

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

module.exports = {
  getRecommendations,
  getTrendingBooks,
  getFeaturedBooks,
  getRelatedBooks,
  searchBooks,
};
