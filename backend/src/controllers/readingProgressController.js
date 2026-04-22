const ReadingProgress = require('../models/ReadingProgress');
const Book = require('../models/Book');

/**
 * Get reading progress for a book
 */
exports.getReadingProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    }).populate('book');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No reading progress found',
      });
    }

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reading progress for user
 */
exports.getUserReadingProgress = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user.userId };
    if (status) {
      query.status = status;
    }

    const progress = await ReadingProgress.find(query)
      .populate('book')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ lastReadAt: -1 });

    const total = await ReadingProgress.countDocuments(query);

    res.json({
      success: true,
      progress,
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
 * Create or start reading a book
 */
exports.startReading = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    let progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    });

    if (!progress) {
      progress = new ReadingProgress({
        user: req.user.userId,
        book: bookId,
        totalPages: book.pages,
        status: 'reading',
      });
    } else {
      progress.status = 'reading';
      progress.lastReadAt = new Date();
    }

    await progress.save();
    await progress.populate('book');

    res.json({
      success: true,
      message: 'Reading started',
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update reading progress
 */
exports.updateReadingProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { currentPage, status } = req.body;

    let progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    });

    if (!progress) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      progress = new ReadingProgress({
        user: req.user.userId,
        book: bookId,
        currentPage: currentPage || 0,
        totalPages: book.pages,
      });
    }

    if (currentPage !== undefined) {
      progress.currentPage = currentPage;
      progress.progressPercentage = (currentPage / progress.totalPages) * 100;
    }

    if (status) {
      progress.status = status;
      if (status === 'completed') {
        progress.completedAt = new Date();
        progress.currentPage = progress.totalPages;
        progress.progressPercentage = 100;
      }
    }

    progress.lastReadAt = new Date();
    await progress.save();
    await progress.populate('book');

    res.json({
      success: true,
      message: 'Reading progress updated',
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add bookmark
 */
exports.addBookmark = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { page, note } = req.body;

    if (page === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Page number is required',
      });
    }

    let progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    });

    if (!progress) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      progress = new ReadingProgress({
        user: req.user.userId,
        book: bookId,
        totalPages: book.pages,
      });
    }

    progress.bookmarks.push({ page, note });
    await progress.save();
    await progress.populate('book');

    res.json({
      success: true,
      message: 'Bookmark added',
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add note
 */
exports.addNote = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { page, content } = req.body;

    if (page === undefined || !content) {
      return res.status(400).json({
        success: false,
        message: 'Page number and content are required',
      });
    }

    let progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    });

    if (!progress) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      progress = new ReadingProgress({
        user: req.user.userId,
        book: bookId,
        totalPages: book.pages,
      });
    }

    progress.notes.push({ page, content });
    await progress.save();
    await progress.populate('book');

    res.json({
      success: true,
      message: 'Note added',
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Enroll in a free book
 */
exports.enrollInBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (!book.isFree) {
      return res.status(400).json({
        success: false,
        message: 'This book is not available for free enrollment',
      });
    }

    // Check if already enrolled
    let progress = await ReadingProgress.findOne({
      user: req.user.userId,
      book: bookId,
    }).populate('book');

    if (progress) {
      return res.json({
        success: true,
        message: 'Already enrolled in this book',
        progress,
      });
    }

    // Create new enrollment
    progress = new ReadingProgress({
      user: req.user.userId,
      book: bookId,
      totalPages: book.pages,
      currentPage: 0,
      progressPercentage: 0,
      status: 'reading',
    });

    await progress.save();
    await progress.populate('book');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in book',
      progress,
    });
  } catch (error) {
    next(error);
  }
};
