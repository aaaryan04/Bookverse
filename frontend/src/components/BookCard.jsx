import React, { useState, useEffect, useCallback } from 'react';
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

  // ✅ FIX: Safe fetch with stable dependency
  const fetchReadingProgress = useCallback(async () => {
    try {
      const response = await readingProgressAPI.getProgress(book._id);
      setReadingProgress(response?.data?.progress || null);
    } catch {
      setReadingProgress(null);
    }
  }, [book?._id]);

  // ✅ FIX: Proper dependency + safe checks
  useEffect(() => {
    if (book?.isFree && user) {
      fetchReadingProgress();
    } else {
      setReadingProgress(null);
    }
  }, [book?.isFree, user, fetchReadingProgress]);

  // ✅ FIX: Read logic
  const handleReadClick = async () => {
    if (!book?.isFree) {
      toast.info('Please purchase this book to read');
      return;
    }

    if (!user) {
      toast.warning('Please log in to enroll in this free book');
      onNavigate('/login');
      return;
    }

    setIsEnrolling(true);

    try {
      await readingProgressAPI.enrollInBook(book._id);
      await fetchReadingProgress();

      toast.success('Enrolled successfully!');
      onNavigate('/learning');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Enrollment failed';
      toast.error(msg);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleQuickView = () => {
    onNavigate(`/books/${book?._id}`);
  };

  return (
    <div
      className={`group rounded-[28px] overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl cursor-pointer ${
        isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
      }`}
    >

      {/* Cover */}
      <div className="relative h-72">
        <img
          src={book?.coverImage}
          alt={book?.title}
          className="w-full h-full object-cover"
          onClick={handleQuickView}
        />

        {/* Rating */}
        <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-xs">
          ⭐ {book?.rating ?? '4.8'}
        </div>

        {/* Price */}
        <div className="absolute top-4 right-4">
          {book?.isFree ? (
            <span className="bg-green-600 text-white px-2 py-1 rounded">
              FREE
            </span>
          ) : (
            <span className="bg-indigo-600 text-white px-2 py-1 rounded">
              ${book?.discountedPrice || book?.price}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">

        <h3 className="font-bold mb-1" onClick={handleQuickView}>
          {book?.title}
        </h3>

        <p className="text-sm mb-2">by {book?.author}</p>

        <p className="text-sm mb-3">
          {book?.description?.slice(0, 100)}
        </p>

        {/* ✅ FIX: progress check */}
        {book?.isFree && readingProgress !== null && (
          <ProgressBar
            progress={readingProgress?.progressPercentage || 0}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-3">

          <button
            onClick={handleReadClick}
            disabled={isEnrolling}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {book?.isFree
              ? isEnrolling ? 'Enrolling...' : 'Read Free'
              : 'Read'}
          </button>

          <button
            onClick={() => onAddToCart(book?._id)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded"
          >
            Cart
          </button>

          <button
            onClick={() => onAddToWishlist(book?._id)}
            className="p-2 bg-gray-200 rounded"
          >
            ❤️
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookCard;
