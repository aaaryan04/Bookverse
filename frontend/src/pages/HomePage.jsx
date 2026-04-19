import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { bookAPI, cartAPI, wishlistAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';
import { FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, trendingRes, categoriesRes] = await Promise.all([
        bookAPI.getFeaturedBooks(),
        bookAPI.getTrendingBooks(),
        bookAPI.getCategories(),
      ]);

      setFeatured(featuredRes.data.books);
      setTrending(trendingRes.data.books);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      await cartAPI.addToCart({ bookId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      await wishlistAPI.addToWishlist(bookId);
      toast.success('Added to wishlist!');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Already in wishlist');
      } else {
        toast.error('Error adding to wishlist');
      }
    }
  };

  return (
    <div className={`min-h-screen transition ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to BookStore Platform
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Discover millions of books, read instantly, and track your reading progress
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/books')}
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                Browse Books <FiArrowRight />
              </button>
              <button
                onClick={() => navigate('/trending')}
                className="px-8 py-3 bg-indigo-800 text-white font-bold rounded-lg hover:bg-indigo-900 transition"
              >
                See Trending
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container-custom">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => navigate(`/books?category=${cat.category}`)}
              className={`p-4 rounded-lg text-center font-medium transition hover:shadow-lg ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-2">{cat.category}</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {cat.count} books
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className={`py-16 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Books</h2>
            <button
              onClick={() => navigate('/books?featured=true')}
              className="text-indigo-600 font-medium hover:text-indigo-700 transition flex items-center gap-2"
            >
              View All <FiArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onNavigate={navigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books */}
      <section className="py-16 container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <button
            onClick={() => navigate('/books?trending=true')}
            className="text-indigo-600 font-medium hover:text-indigo-700 transition flex items-center gap-2"
          >
            View All <FiArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onNavigate={navigate}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`p-8 rounded-lg text-center ${
                isDark
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2">Vast Library</h3>
              <p>Access thousands of books across all genres and categories</p>
            </div>
            <div
              className={`p-8 rounded-lg text-center ${
                isDark
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Access</h3>
              <p>Start reading immediately after purchase, no waiting</p>
            </div>
            <div
              className={`p-8 rounded-lg text-center ${
                isDark
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p>Monitor your reading progress with bookmarks and notes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
