import React from 'react';

const ProgressBar = ({ progress, className = '', showPercentage = true, size = 'medium' }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium text-gray-700 dark:text-gray-300 ${textSizeClasses[size]}`}>
          Progress
        </span>
        {showPercentage && (
          <span className={`font-semibold text-indigo-600 dark:text-indigo-400 ${textSizeClasses[size]}`}>
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && (
        <div className="flex items-center justify-center mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;