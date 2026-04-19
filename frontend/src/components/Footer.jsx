import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`mt-20 transition ${
        isDark
          ? 'bg-slate-900 border-t border-slate-700'
          : 'bg-gray-900 border-t border-gray-800'
      } text-white py-12`}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">📚 BookStore</h3>
            <p className="text-gray-400">
              Your ultimate destination for digital and physical books.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Browse</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/books" className="hover:text-white transition">
                  All Books
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="/trending" className="hover:text-white transition">
                  Trending
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/login" className="hover:text-white transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition">
                  Register
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  My Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BookStore Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
