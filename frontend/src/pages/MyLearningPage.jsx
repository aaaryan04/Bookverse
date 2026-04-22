import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBookOpen, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';

import { useTheme } from '../context/ThemeContext';
import { readingProgressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import BookCard from '../components/BookCard';

const MyLearningPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [learningBooks, setLearningBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completed: 0,
    inProgress: 0,
    totalProgress: 0
  });

  useEffect(() => {
    fetchLearningProgress();
  }, []);

  const fetchLearningProgress = async () => {
    try {
      const response = await readingProgressAPI.getUserProgress();
      const progress = response.data.progress;

      setLearningBooks(progress);

      // Calculate stats
      const totalEnrolled = progress.length;
      const completed = progress.filter(book => book.status === 'completed').length;
      const inProgress = progress.filter(book => book.status === 'reading').length;
      const totalProgress = progress.reduce((acc, book) => acc + book.progressPercentage, 0) / totalEnrolled || 0;

      setStats({
        totalEnrolled,
        completed,
        inProgress,
        totalProgress
      });
    } catch (error) {
      console.error('Failed to fetch learning progress:', error);
      toast.error('Failed to load learning progress');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAddToCart = (bookId) => {
    // Not applicable for learning page
  };

  const handleAddToWishlist = (bookId) => {
    // Not applicable for learning page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Learning
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and continue learning from your enrolled books
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEnrolled}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProgress.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Books */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Learning Books
        </h2>

        {learningBooks.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-xl`}>
            <FiBookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books enrolled yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your learning journey by enrolling in free books
            </p>
            <button
              onClick={() => navigate('/books')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Free Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningBooks.map((progress) => (
              <div
                key={progress._id}
                className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
              >
                <div className="relative">
                  <img
                    src={progress.book.coverImage}
                    alt={progress.book.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      progress.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {progress.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {progress.book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    by {progress.book.author}
                  </p>

                  <div className="mb-4">
                    <ProgressBar progress={progress.progressPercentage} />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>Page {progress.currentPage} of {progress.totalPages}</span>
                    <span>Last read: {new Date(progress.lastReadAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/books/${progress.book._id}/read`)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <FiBookOpen size={16} />
                    {progress.status === 'completed' ? 'Review Book' : 'Continue Reading'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearningPage;