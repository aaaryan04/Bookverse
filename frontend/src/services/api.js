import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Book APIs
export const bookAPI = {
  getAllBooks: (params) => apiClient.get('/books', { params }),
  getBook: (id) => apiClient.get(`/books/${id}`),
  searchBooks: (query, filters) => apiClient.get('/books/search', { params: { q: query, ...filters } }),
  getFeaturedBooks: () => apiClient.get('/books/featured'),
  getTrendingBooks: () => apiClient.get('/books/trending'),
  getRelatedBooks: (id) => apiClient.get(`/books/${id}/related`),
  getCategories: () => apiClient.get('/books/categories'),
};

// Cart APIs
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart', data),
  updateCartItem: (bookId, data) => apiClient.put(`/cart/${bookId}`, data),
  removeFromCart: (bookId) => apiClient.delete(`/cart/${bookId}`),
  clearCart: () => apiClient.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => apiClient.post('/orders', data),
  getUserOrders: (params) => apiClient.get('/orders', { params }),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
};

// Review APIs
export const reviewAPI = {
  getBookReviews: (bookId, params) => apiClient.get(`/books/${bookId}/reviews`, { params }),
  createReview: (bookId, data) => apiClient.post(`/books/${bookId}/reviews`, data),
  updateReview: (reviewId, data) => apiClient.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}`),
};

// Reading Progress APIs
export const readingProgressAPI = {
  getProgress: (bookId) => apiClient.get(`/reading/${bookId}`),
  getUserProgress: (params) => apiClient.get('/reading', { params }),
  startReading: (bookId) => apiClient.post(`/reading/${bookId}/start`),
  updateProgress: (bookId, data) => apiClient.put(`/reading/${bookId}`, data),
  addBookmark: (bookId, data) => apiClient.post(`/reading/${bookId}/bookmark`, data),
  addNote: (bookId, data) => apiClient.post(`/reading/${bookId}/note`, data),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => apiClient.get('/wishlist'),
  addToWishlist: (bookId) => apiClient.post(`/wishlist/${bookId}`),
  removeFromWishlist: (bookId) => apiClient.delete(`/wishlist/${bookId}`),
  isInWishlist: (bookId) => apiClient.get(`/wishlist/${bookId}`),
};

export default apiClient;
