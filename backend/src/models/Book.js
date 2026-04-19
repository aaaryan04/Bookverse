const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Programming', 'Business', 'Self-Development', 'Fiction', 'Cybersecurity', 'Psychology'],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
    },
    pages: {
      type: Number,
      default: 0,
    },
    publicationDate: Date,
    isbn: String,
    language: {
      type: String,
      default: 'English',
    },
    format: {
      type: String,
      enum: ['eBook', 'Paperback', 'Hardcover'],
      default: 'eBook',
    },
    stock: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for search optimization
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
