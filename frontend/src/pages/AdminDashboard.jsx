import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiBook, FiShoppingCart, FiDollarSign, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      toast.error('Admin access only');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 py-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.firstName} {user?.lastName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm uppercase tracking-wide">Total Books</p>
                <p className="text-4xl font-bold mt-2">{stats?.totalBooks || 0}</p>
              </div>
              <FiBook className="text-4xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm uppercase tracking-wide">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{stats?.totalOrders || 0}</p>
              </div>
              <FiShoppingCart className="text-4xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-bold mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <FiUsers className="text-4xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">${(stats?.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <FiDollarSign className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/books')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition shadow-lg"
          >
            Manage Books
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition shadow-lg"
          >
            View Orders
          </button>
        </div>

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-slate-300 font-semibold py-3">Order ID</th>
                    <th className="text-slate-300 font-semibold py-3">Customer</th>
                    <th className="text-slate-300 font-semibold py-3">Amount</th>
                    <th className="text-slate-300 font-semibold py-3">Status</th>
                    <th className="text-slate-300 font-semibold py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-800">
                      <td className="text-slate-300 py-3">{order._id.slice(-6)}</td>
                      <td className="text-slate-300 py-3">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="text-slate-300 py-3">${order.finalAmount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          order.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-slate-300 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
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

export default AdminDashboard;
