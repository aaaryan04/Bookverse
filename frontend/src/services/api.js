import axios from "axios";

// ✅ Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// ⚠️ Debug check
if (!API_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

// ✅ Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= AUTH APIs =================
export const authAPI = {
  register: (data) => apiClient.post("/api/auth/register", data),
  login: (data) => apiClient.post("/api/auth/login", data),
  getProfile: () => apiClient.get("/api/auth/profile"),
  updateProfile: (data) => apiClient.put("/api/auth/profile", data),
};

// ================= BOOK APIs =================
export const bookAPI = {
  getAllBooks: (params) => apiClient.get("/api/books", { params }),
  getBook: (id) => apiClient.get(`/api/books/${id}`),
  searchBooks: (query, filters) =>
    apiClient.get("/api/books/search", { params: { q: query, ...filters } }),
  getFeaturedBooks: () => apiClient.get("/api/books/featured"),
  getTrendingBooks: () => apiClient.get("/api/books/trending"),
  getRelatedBooks: (id) => apiClient.get(`/api/books/${id}/related`),
  getCategories: () => apiClient.get("/api/books/categories"),
};

// ================= CART APIs =================
export const cartAPI = {
  getCart: () => apiClient.get("/api/cart"),
  addToCart: (data) => apiClient.post("/api/cart", data),
  updateCartItem: (bookId, data) =>
    apiClient.put(`/api/cart/${bookId}`, data),
  removeFromCart: (bookId) =>
    apiClient.delete(`/api/cart/${bookId}`),
  clearCart: () => apiClient.delete("/api/cart"),
};

// ================= ORDER APIs =================
export const orderAPI = {
  createOrder: (data) => apiClient.post("/api/orders", data),
  getUserOrders: (params) => apiClient.get("/api/orders", { params }),
  getOrder: (id) => apiClient.get(`/api/orders/${id}`),
};

// ================= REVIEW APIs =================
export const reviewAPI = {
  getBookReviews: (bookId, params) =>
    apiClient.get(`/api/books/${bookId}/reviews`, { params }),
  createReview: (bookId, data) =>
    apiClient.post(`/api/books/${bookId}/reviews`, data),
  updateReview: (reviewId, data) =>
    apiClient.put(`/api/reviews/${reviewId}`, data),
  deleteReview: (reviewId) =>
    apiClient.delete(`/api/reviews/${reviewId}`),
};

// ================= READING PROGRESS =================
export const readingProgressAPI = {
  getProgress: (bookId) => apiClient.get(`/api/reading/${bookId}`),
  getUserProgress: (params) =>
    apiClient.get("/api/reading", { params }),
  startReading: (bookId) =>
    apiClient.post(`/api/reading/${bookId}/start`),
  updateProgress: (bookId, data) =>
    apiClient.put(`/api/reading/${bookId}`, data),
  addBookmark: (bookId, data) =>
    apiClient.post(`/api/reading/${bookId}/bookmark`, data),
  addNote: (bookId, data) =>
    apiClient.post(`/api/reading/${bookId}/note`, data),
};

// ================= WISHLIST APIs =================
export const wishlistAPI = {
  getWishlist: () => apiClient.get("/api/wishlist"),
  addToWishlist: (bookId) =>
    apiClient.post(`/api/wishlist/${bookId}`),
  removeFromWishlist: (bookId) =>
    apiClient.delete(`/api/wishlist/${bookId}`),
  isInWishlist: (bookId) =>
    apiClient.get(`/api/wishlist/${bookId}`),
};

export default apiClient;