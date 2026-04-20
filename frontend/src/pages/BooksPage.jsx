import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { bookAPI, cartAPI, wishlistAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';

const BooksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category');
  const trending = searchParams.get('trending') === 'true';
  const featured = searchParams.get('featured') === 'true';

  const pageTitle = trending
    ? 'Trending Books'
    : featured
    ? 'Featured Books'
    : category
    ? `${category} Books`
    : 'All Books';

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookRequest = trending
          ? bookAPI.getTrendingBooks({ limit: 100 })
          : featured
          ? bookAPI.getFeaturedBooks({ limit: 100 })
          : bookAPI.getAllBooks({ category, limit: 100 });

        const [booksResponse, categoriesResponse] = await Promise.all([
          bookRequest,
          bookAPI.getCategories(),
        ]);

        setBooks(booksResponse.data.books || booksResponse.data.results || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.response?.data?.message || 'Unable to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, trending, featured]);

  const handleAddToCart = async (bookId) => {
    try {
      await cartAPI.addToCart({ bookId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      await wishlistAPI.addToWishlist(bookId);
      toast.success('Added to wishlist!');
    } catch (err) {
      if (err.response?.status === 400) {
        toast.info('Already in wishlist');
      } else {
        toast.error('Error adding to wishlist');
      }
    }
  };

  return (
    <div className={`min-h-screen transition ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <section className="py-16 container-custom">
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
                Browse the full collection of books{category ? ` in ${category}` : trending ? ' that are trending now' : ''}. Explore popular titles, filter by category, and add favorites to your cart.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/books?featured=true')}
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-700 transition"
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => navigate('/books?trending=true')}
                className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-900 transition"
              >
                Trending
              </button>
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                All Books
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-2xl shadow-indigo-500/20">
              <p className="text-sm uppercase tracking-[0.24em] font-semibold opacity-90">Best Sellers</p>
              <h2 className="mt-4 text-3xl font-bold">Browse top picks</h2>
              <p className="mt-3 text-sm leading-6 text-indigo-100/90">Handpicked titles that readers love and rate highly.</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">Categories</p>
              <div className="mt-5 grid gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => navigate(`/books?category=${cat.category}`)}
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-100 hover:bg-slate-900 transition"
                  >
                    {cat.category} <span className="text-slate-400">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900 p-6 shadow-lg border border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">Why Shop Here</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>• Instant digital access</li>
                <li>• Curated trending collections</li>
                <li>• Easy wishlist and cart experience</li>
              </ul>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-lg font-medium text-gray-500">Loading books...</div>
        ) : error ? (
          <div className="text-center py-24 text-lg font-medium text-red-500">{error}</div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 text-lg font-medium text-gray-500">No books found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}
      </section>
    </div>
  );
};

export default BooksPage;
