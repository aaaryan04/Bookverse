import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { readingProgressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const MyLearningPage = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [learningBooks, setLearningBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completed: 0,
    inProgress: 0,
    totalProgress: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchLearningProgress();
  }, [isAuthenticated, navigate]);

  const fetchLearningProgress = async () => {
    try {
      const response = await readingProgressAPI.getUserProgress();
      const progress = response.data.progress || [];

      setLearningBooks(progress);

      if (progress.length === 0) {
        setStats({
          totalEnrolled: 0,
          completed: 0,
          inProgress: 0,
          totalProgress: 0,
        });
        return;
      }

      const totalEnrolled = progress.length;
      const completed = progress.filter(
        (p) => p.status === 'completed'
      ).length;
      const inProgress = progress.filter(
        (p) => p.status === 'reading'
      ).length;
      const avgProgress =
        progress.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) /
        totalEnrolled;

      setStats({
        totalEnrolled,
        completed,
        inProgress,
        totalProgress: avgProgress,
      });
    } catch (error) {
      console.error('Failed to fetch learning progress:', error);
      toast.error('Failed to load learning progress');
    } finally {
      setLoading(false);
    }
  };


  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Learning
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your reading progress and continue learning
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Enrolled */}
          <div
            className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Enrolled
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEnrolled}
                </p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div
            className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div
            className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </div>

          {/* Avg Progress */}
          <div
            className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProgress.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Books */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Books
          </h2>

          {learningBooks.length === 0 ? (
            <div
              className={`text-center py-16 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg`}
            >
              <FiBookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No books enrolled yet
              </h3>
              <p
                className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
              >
                Start your learning journey by enrolling in free books
              </p>
              <button
                onClick={() => navigate('/books')}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Browse Books
                <FiArrowRight size={18} />
              </button>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningBooks.map((progress) => (
                <div
                  key={progress._id}
                  className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg hover:shadow-xl transition`}
                >
                  {/* Book Cover */}
                  <div className="relative">
                    <img
                      src={progress.book.coverImage}
                      alt={progress.book.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          progress.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {progress.status === 'completed'
                          ? '✓ Completed'
                          : 'Reading'}
                      </span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {progress.book.title}
                    </h3>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}
                    >
                      by {progress.book.author}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <ProgressBar
                        progress={progress.progressPercentage || 0}
                        size="medium"
                      />
                    </div>

                    {/* Page Info */}
                    <div
                      className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      <p>
                        Page {progress.currentPage} of{' '}
                        {progress.totalPages}
                      </p>
                      <p>
                        Last read:{' '}
                        {new Date(progress.lastReadAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() => navigate(`/books/${progress.book._id}`)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <FiBookOpen size={16} />
                      {progress.status === 'completed'
                        ? 'Review'
                        : 'Continue'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;