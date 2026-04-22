import React, { useState, useEffect, useCallback } from 'react';

import { FiStar, FiHeart, FiPlay, FiBookOpen } from 'react-icons/fi';

import { useTheme } from '../context/ThemeContext';
import { readingProgressAPI } from '../services/api';
import ProgressBar from './ProgressBar';



const BookCard = ({ book, onAddToCart, onAddToWishlist, onNavigate, showProgress = true }) => {
  const { isDark } = useTheme();
  const [readingProgress, setReadingProgress] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fetchReadingProgress = useCallback(async () => {
    try {
      const response = await readingProgressAPI.getProgress(book._id);
      setReadingProgress(response.data.progress);
    } catch (error) {
      // User hasn't enrolled yet, that's fine
      setReadingProgress(null);
    }
  }, [book._id]);

  useEffect(() => {
    if (showProgress && book.isFree) {
      fetchReadingProgress();
    }
  }, [book._id, showProgress, book.isFree, fetchReadingProgress]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await readingProgressAPI.startReading(book._id);
      await fetchReadingProgress();
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleContinueReading = () => {
    onNavigate(`/books/${book._id}/read`);
  };



  const handleQuickView = () => {

    onNavigate(`/books/${book._id}`);

  };



  return (

    <div

      className={`group rounded-[28px] overflow-hidden border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)] cursor-pointer animate-slide-in ${

        isDark

          ? 'bg-slate-900 text-white'

          : 'bg-white text-gray-900'

      }`}

    >

      <div className="relative overflow-hidden bg-slate-200 h-72">

        <img

          src={book.coverImage}

          alt={book.title}

          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"

          onClick={handleQuickView}

        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">

          <FiStar className="text-yellow-500" size={14} />

          {book.rating ?? '4.8'}

        </div>

        <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          {book.isFree ? (
            <span className="bg-green-600">FREE</span>
          ) : (
            <span className="bg-indigo-600">${book.discountedPrice || book.price}</span>
          )}
        </div>

      </div>



      <div className="p-5">

        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] font-semibold text-indigo-600 mb-3">

          <span>{book.category}</span>

          {book.isFeatured && <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full">Featured</span>}

        </div>



        <h3

          className="text-xl font-bold leading-tight mb-2 hover:text-indigo-600 transition"

          onClick={handleQuickView}

        >

          {book.title}

        </h3>

        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>

          by {book.author}

        </p>



        <p className={`text-sm leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>

          {book.description?.slice(0, 120) || 'A great read for anyone who loves books and learning.'}

        </p>



        {book.isFree && readingProgress && (
          <div className="mb-4">
            <ProgressBar progress={readingProgress.progressPercentage} size="small" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {book.isFree ? (
            readingProgress ? (
              <button
                onClick={handleContinueReading}
                className="flex-1 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/10 hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FiBookOpen size={16} />
                Continue Reading
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/10 hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlay size={16} />
                {isEnrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
              </button>
            )
          ) : (
            <button
              onClick={() => onAddToCart(book._id)}
              className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
          )}

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

