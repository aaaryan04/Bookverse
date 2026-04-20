import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition ${
        isDark
          ? 'bg-slate-900 border-b border-slate-700'
          : 'bg-white border-b border-gray-200'
      } shadow-md`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📚 BookStore
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-100 border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isDark ? (
                <FiSun size={18} className="text-yellow-500" />
              ) : (
                <FiMoon size={18} />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm font-medium">{user?.firstName}</span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <FiUser size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {menuOpen && (
          <form
            onSubmit={handleSearch}
            className="md:hidden pb-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-gray-100 border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;
