import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { bookAPI, cartAPI, wishlistAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSearch, FiFilter, FiX } from 'react-icons/fi';

const BooksPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const category = searchParams.get('category');
  const trending = searchParams.get('trending') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const isFree = searchParams.get('isFree') === 'true';

  const pageTitle = trending
    ? 'Trending Books'
    : featured
    ? 'Featured Books'
    : isFree
    ? 'Free Learning Books'
    : category
    ? `${category} Books`
    : searchQuery
    ? `Search Results for "${searchQuery}"`
    : 'All Books';

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let booksResponse;
      
      if (debouncedSearchQuery.trim()) {
        // Use search API
        booksResponse = await bookAPI.searchBooks(debouncedSearchQuery, {
          category: category || undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          isFree: isFree || undefined,
        });
        setBooks(booksResponse.data.results || []);
        setTotalPages(booksResponse.data.pagination?.pages || 1);
      } else if (trending) {
        booksResponse = await bookAPI.getTrendingBooks({ limit: 50 });
        setBooks(booksResponse.data.books || []);
        setTotalPages(1);
      } else if (featured) {
        booksResponse = await bookAPI.getFeaturedBooks({ limit: 50 });
        setBooks(booksResponse.data.books || []);
        setTotalPages(1);
      } else {
        booksResponse = await bookAPI.getAllBooks({
          category: category || undefined,
          page,
          limit: 12,
          sortBy,
          isFree: isFree || undefined,
        });
        setBooks(booksResponse.data.books || []);
        setTotalPages(booksResponse.data.pagination?.pages || 1);
      }

      // Fetch categories in parallel
      try {
        const categoriesResponse = await bookAPI.getCategories();
        setCategories(categoriesResponse.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.response?.data?.message || 'Unable to load books');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, category, trending, featured, page, priceRange, minRating, sortBy, isFree]);

  // Debounced search handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddToCart = async (bookId) => {
    if (!user) {
      toast.warning('Please log in to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await cartAPI.addToCart({ bookId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Cart error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error adding to cart';
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
    } catch (err) {
      if (err.response?.status === 400) {
        toast.info('Already in wishlist');
      } else {
        console.error('Wishlist error:', err);
        toast.error('Error adding to wishlist');
      }
    }
  };

  return (
    <div className={`min-h-screen transition ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <section className="py-16 container-custom">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-6 rounded-[2rem] bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl border border-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50"
              >
                <FiArrowLeft /> Back
              </button>
              <h1 className={`mt-6 text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {pageTitle}
              </h1>
              <p className={`mt-3 max-w-2xl text-base leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Browse books with powerful search and filters. Find exactly what you're looking for.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchParams({ featured: 'true' });
                  handleClearSearch();
                }}
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition"
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchParams({ trending: 'true' });
                  handleClearSearch();
                }}
                className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-900 transition"
              >
                Trending
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchParams({});
                  handleClearSearch();
                }}
                className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                All Books
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3">
              <FiSearch className="text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search books by title, author, or keyword..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="text-slate-400 hover:text-white transition"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Filter and Sort Options */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              <FiFilter /> Filters {(priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0) && '(Active)'}
            </button>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-300">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                  setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value });
                }}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white outline-none hover:border-slate-600 transition"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Rating: High to Low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid gap-4 rounded-xl bg-slate-900/50 p-4 border border-slate-700">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-3">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => {
                        if (category === cat.category) {
                          setSearchParams({});
                        } else {
                          setSearchParams({ category: cat.category });
                        }
                        setPage(1);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        category === cat.category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.category} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <div className="flex gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Minimum Rating: {minRating.toFixed(1)} ⭐</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setMinRating(0);
                  setShowFilters(false);
                }}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Free Books Section */}
        {!searchQuery && !category && !trending && !featured && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Free Learning Books</h2>
                <p className="text-slate-400">Start your learning journey with our collection of free educational books</p>
              </div>
              <button
                onClick={() => {
                  setSearchParams({ isFree: 'true' });
                  setPage(1);
                }}
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                View All Free Books →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.filter(book => book.isFree).slice(0, 4).map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onNavigate={navigate}
                  showProgress={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-24 text-lg font-medium text-gray-500">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              Loading books...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <div className={`inline-block rounded-lg p-6 ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-semibold ${isDark ? 'text-red-200' : 'text-red-800'}`}>Error Loading Books</p>
              <p className={`text-sm mt-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              <button
                onClick={() => fetchBooks()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <div className={`inline-block rounded-lg p-6 ${isDark ? 'bg-slate-900/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
              <p className={`font-semibold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {searchQuery ? 'No books found' : 'No books available'}
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery ? 'Try adjusting your search or filters' : 'Please check back later'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onNavigate={navigate}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !searchQuery && (
              <div className="flex justify-center items-center gap-2 py-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page > totalPages - 3) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition ${
                        page === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                >
                  Next
                </button>
                <span className="ml-4 text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default BooksPage;
