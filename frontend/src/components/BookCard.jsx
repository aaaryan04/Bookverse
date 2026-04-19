import React from 'react';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const BookCard = ({ book, onAddToCart, onAddToWishlist, onNavigate }) => {
  const { isDark } = useTheme();

  const handleQuickView = () => {
    onNavigate(`/books/${book._id}`);
  };

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all hover:shadow-lg cursor-pointer animate-slide-in ${
        isDark
          ? 'bg-slate-800 text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-200 h-64 group">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          onClick={handleQuickView}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">
            ${book.discountedPrice || book.price}
          </span>
        </div>
        {book.isFeatured && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-indigo-600 font-medium">{book.category}</p>
        <h3
          className="text-lg font-bold mt-1 line-clamp-2 hover:text-indigo-600 transition"
          onClick={handleQuickView}
        >
          {book.title}
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
          <span className="text-sm font-medium">{book.rating}</span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            ({book.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">
            ${book.discountedPrice || book.price}
          </span>
          {book.discountedPrice && (
            <span className={`text-sm line-through ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              ${book.price}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onAddToCart(book._id)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            <FiShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={() => onAddToWishlist(book._id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FiHeart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
