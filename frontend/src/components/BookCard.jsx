import React, { useState, useEffect, useCallback } from 'react';
import { FiStar, FiHeart, FiBook } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { readingProgressAPI } from '../services/api';
import ProgressBar from './ProgressBar';

const BookCard = ({ book, onAddToCart, onAddToWishlist, onNavigate }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [readingProgress, setReadingProgress] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch reading progress only for free books
  const fetchReadingProgress = useCallback(async () => {
    try {
      const response = await readingProgressAPI.getProgress(book._id);
      setReadingProgress(response.data.progress);
    } catch {
      setReadingProgress(null);
    }
  }, [book._id]);

  useEffect(() => {
    if (book.isFree && user) {
      fetchReadingProgress();
    } else {
      setReadingProgress(null);
    }
  }, [book._id, book.isFree, user, fetchReadingProgress]);

  const handleReadClick = async () => {
    if (book.isFree) {
      if (!user) {
        toast.warning('Please log in to enroll in this free book');
        onNavigate('/login');
        return;
      }

      // Enroll in free book
      setIsEnrolling(true);
      try {
        await readingProgressAPI.enrollInBook(book._id);
        await fetchReadingProgress();
        toast.success('Enrolled in book! Start reading now.');
        onNavigate(`/learning`);
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to enroll';
        toast.error(msg);
      } finally {
        setIsEnrolling(false);
      }
    } else {
      // Paid book - show message
      toast.info('Please purchase this book to read');
    }
  };

  const handleQuickView = () => {
    onNavigate(`/books/${book._id}`);
  };

  return (
    <div
      className={`group rounded-[28px] overflow-hidden border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)] cursor-pointer animate-slide-in ${
        isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-slate-200 h-72">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onClick={handleQuickView}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
          <FiStar className="text-yellow-500" size={14} />
          {book.rating ?? '4.8'}
        </div>

        {/* Price/Free Badge */}
        <div className="absolute top-4 right-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          {book.isFree ? (
            <span className="bg-green-600 px-2 py-1 rounded-full">FREE</span>
          ) : (
            <span className="bg-indigo-600 px-2 py-1 rounded-full">
              ${book.discountedPrice || book.price}
            </span>
          )}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-5">
        {/* Category & Featured */}
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] font-semibold text-indigo-600 mb-3">
          <span>{book.category}</span>
          {book.isFeatured && (
            <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold leading-tight mb-2 hover:text-indigo-600 transition"
          onClick={handleQuickView}
        >
          {book.title}
        </h3>

        {/* Author */}
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          by {book.author}
        </p>

        {/* Description */}
        <p
          className={`text-sm leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
        >
          {book.description?.slice(0, 120) || 'A great read for anyone.'}
        </p>

        {/* Progress Bar - Show only if free and enrolled */}
        {book.isFree && readingProgress && (
          <div className="mb-4">
            <ProgressBar
              progress={readingProgress.progressPercentage}
              size="small"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Read/Enroll Button */}
          <button
            onClick={handleReadClick}
            disabled={isEnrolling}
            className="flex-1 rounded-2xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiBook size={16} />
            <span className="hidden sm:inline">
              {book.isFree
                ? isEnrolling ? 'Enrolling...' : 'Read Free'
                : 'Read'}
            </span>
            <span className="sm:hidden">
              {book.isFree ? 'Read' : 'Read'}
            </span>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(book._id)}
            className="flex-1 rounded-2xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition"
          >
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onAddToWishlist(book._id)}
            className={`rounded-2xl p-3 transition ${
              isDark
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            }`}
          >
            <FiHeart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;