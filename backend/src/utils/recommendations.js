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
 * Search books with full-text search and filters
 * Supports searching by title, author, description, and tags
 */
const searchBooks = async (query, filters = {}) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    // Escape special regex characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = new RegExp(escapedQuery, 'i');

    // Build search query with OR conditions for multiple fields
    const searchQuery = {
      $or: [
        { title: regexPattern },
        { author: regexPattern },
        { description: regexPattern },
        { tags: { $regex: escapedQuery, $options: 'i' } },
      ],
    };

    // Add category filter if provided
    if (filters.category && filters.category !== 'all') {
      searchQuery.category = filters.category;
    }

    // Add price filter if both min and max are provided
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      const minPrice = parseFloat(filters.minPrice);
      const maxPrice = parseFloat(filters.maxPrice);
      
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        searchQuery.price = {
          $gte: minPrice,
          $lte: maxPrice,
        };
      }
    }

    // Add rating filter if provided
    if (filters.minRating !== undefined) {
      const minRating = parseFloat(filters.minRating);
      if (!isNaN(minRating) && minRating > 0) {
        searchQuery.rating = { $gte: minRating };
      }
    }

    // Add free-book filter if requested
    if (filters.isFree === 'true') {
      searchQuery.isFree = true;
    }

    // Execute search query with sorting and pagination
    const limit = parseInt(filters.limit) || 50;
    const skip = (parseInt(filters.page) || 0) * limit;

    const results = await Book.find(searchQuery)
      .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
