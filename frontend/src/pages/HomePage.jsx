import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { bookAPI, cartAPI, wishlistAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
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
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load home data. Please ensure the backend server is running on http://localhost:5000';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleAddToCart = async (bookId) => {
    if (!user) {
      toast.warning('Please log in to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await cartAPI.addToCart({ bookId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Cart error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error adding to cart';
      toast.error(errorMsg);
    }
  };

  const handleAddToWishlist = async (bookId) => {
    if (!user) {
      toast.warning('Please log in to add items to wishlist');
      navigate('/login');
      return;
    }
    try {
      await wishlistAPI.addToWishlist(bookId);
      toast.success('Added to wishlist!');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Already in wishlist');
      } else {
        console.error('Wishlist error:', error);
        toast.error('Error adding to wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container-custom py-24 text-center">
          <p className={isDark ? 'text-white' : 'text-gray-900'}>Loading home content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="container-custom py-24 text-center">
          <div className={`rounded-lg p-6 ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-semibold ${isDark ? 'text-red-200' : 'text-red-800'}`}>Error Loading Content</p>
            <p className={`text-sm mt-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.45),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.35),_transparent_30%)]" />
        <div className="relative container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-indigo-900/20 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 block" />
              New launch — explore trending books
            </div>
            <h1 className="mt-8 text-5xl md:text-6xl font-black leading-tight">
              Discover your next favorite book in minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-100/90">
              Explore curated collections, browse categories, and unlock bestselling titles with personalized recommendations.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/books')}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-700 transition"
              >
                Browse Books <FiArrowRight className="ml-2" />
              </button>
              <button
                onClick={() => navigate('/books?trending=true')}
                className="inline-flex items-center justify-center rounded-full bg-indigo-500/90 border border-indigo-400/30 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition"
              >
                Trending Now
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex gap-2 bg-white/10 rounded-full p-2 border border-white/20 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/50 outline-none px-6 py-2"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2 font-semibold flex items-center gap-2 transition"
                >
                  <FiSearch /> Search
                </button>
              </div>
            </form>

            <div className="mt-12 grid grid-cols-3 gap-4">
              {trending.slice(0, 3).map((book) => (
                <div key={book._id} className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-sm text-indigo-100 font-semibold">{book.category}</p>
                  <h3 className="mt-2 text-sm font-bold text-white leading-snug">{book.title}</h3>
                  <p className="mt-2 text-xs text-slate-200">by {book.author}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] bg-white/10 p-8 shadow-2xl shadow-indigo-900/20 backdrop-blur-xl border border-white/10">
              <div className="grid gap-6 sm:grid-cols-2">
                {featured.slice(0, 4).map((book) => (
                  <div key={book._id} className="group overflow-hidden rounded-3xl bg-slate-950/80 shadow-inner shadow-slate-900/20 transition hover:-translate-y-1">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-indigo-300">{book.category}</p>
                      <h3 className="mt-2 text-base font-bold text-white">{book.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/books?trending=true')}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Trending Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container-custom">
        <h2 className="text-3xl font-bold mb-8 text-white">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => navigate(`/books?category=${cat.category}`)}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-left text-slate-100 transition hover:bg-slate-800 shadow-lg shadow-slate-950/20"
            >
              <div className="text-2xl mb-2">{cat.category}</div>
              <div className="text-sm text-slate-400">{cat.count} books</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-slate-950">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Books</h2>
            <button
              onClick={() => navigate('/books?featured=true')}
              className="text-indigo-300 font-medium hover:text-indigo-100 transition flex items-center gap-2"
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
      <section className="py-16 bg-slate-950">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-950/20 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2">Vast Library</h3>
              <p>Access thousands of books across all genres and categories</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-950/20 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Access</h3>
              <p>Start reading immediately after purchase, no waiting</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-950/20 text-center">
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
