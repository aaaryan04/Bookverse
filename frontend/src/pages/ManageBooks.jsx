import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const ManageBooks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Programming',
    price: '',
    coverImage: '',
    pages: '',
    isbn: '',
    stock: '',
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      toast.error('Admin access only');
      return;
    }
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBooks({ page: 1, limit: 10 });
      setBooks(response.data.books);
    } catch (error) {
      toast.error('Failed to load books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        pages: parseInt(formData.pages) || 0,
        stock: parseInt(formData.stock) || 0,
      };

      if (editingBook) {
        await adminAPI.updateBook(editingBook._id, bookData);
        toast.success('Book updated successfully');
      } else {
        await adminAPI.createBook(bookData);
        toast.success('Book added successfully');
      }

      setShowForm(false);
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        category: 'Programming',
        price: '',
        coverImage: '',
        pages: '',
        isbn: '',
        stock: '',
      });
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
      console.error(error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      price: book.price,
      coverImage: book.coverImage,
      pages: book.pages,
      isbn: book.isbn,
      stock: book.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await adminAPI.deleteBook(id);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'Programming',
      price: '',
      coverImage: '',
      pages: '',
      isbn: '',
      stock: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 py-4">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-slate-300 hover:text-white transition"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-white">Manage Books</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus /> Add Book
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Programming</option>
                    <option>Business</option>
                    <option>Self-Development</option>
                    <option>Fiction</option>
                    <option>Cybersecurity</option>
                    <option>Psychology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300">Loading books...</p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Title</th>
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Author</th>
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Category</th>
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Price</th>
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Stock</th>
                    <th className="text-left text-slate-300 font-semibold py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id} className="border-b border-slate-700 hover:bg-slate-800">
                      <td className="text-slate-300 py-3 px-4">{book.title}</td>
                      <td className="text-slate-300 py-3 px-4">{book.author}</td>
                      <td className="text-slate-300 py-3 px-4">{book.category}</td>
                      <td className="text-slate-300 py-3 px-4">${book.price.toFixed(2)}</td>
                      <td className="text-slate-300 py-3 px-4">{book.stock}</td>
                      <td className="text-slate-300 py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
