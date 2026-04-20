import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const ManageOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      toast.error('Admin access only');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 10 };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      case 'refunded':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-300" />;
      case 'pending':
        return <FiClock className="text-yellow-300" />;
      case 'cancelled':
        return <FiXCircle className="text-red-300" />;
      case 'refunded':
        return <FiXCircle className="text-blue-300" />;
      default:
        return null;
    }
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
            <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setStatusFilter('');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => {
              setStatusFilter('pending');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setStatusFilter('completed');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => {
              setStatusFilter('cancelled');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-300">No orders found</p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Order ID</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Customer</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Items</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Amount</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Status</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Date</th>
                    <th className="text-left text-slate-300 font-semibold py-4 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-700 hover:bg-slate-800 transition"
                    >
                      <td className="text-slate-300 py-4 px-4 font-mono text-sm">
                        {order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="text-slate-300 py-4 px-4">
                        {order.user?.firstName} {order.user?.lastName}
                      </td>
                      <td className="text-slate-300 py-4 px-4 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="text-slate-300 py-4 px-4 font-semibold">
                        ${order.finalAmount.toFixed(2)}
                      </td>
                      <td className="text-slate-300 py-4 px-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </td>
                      <td className="text-slate-300 py-4 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-slate-300 py-4 px-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-800 p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Order Details - {selectedOrder._id.slice(-6)}</h2>
            </div>

            <div className="p-6">
              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="bg-slate-800 rounded p-4 space-y-2">
                  <p className="text-slate-300">
                    <span className="font-medium text-slate-200">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium text-slate-200">Email:</span> {selectedOrder.user?.email}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="bg-slate-800 rounded overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="text-left text-slate-300 font-semibold py-2 px-4">Book</th>
                        <th className="text-left text-slate-300 font-semibold py-2 px-4">Qty</th>
                        <th className="text-left text-slate-300 font-semibold py-2 px-4">Price</th>
                        <th className="text-left text-slate-300 font-semibold py-2 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-700">
                          <td className="text-slate-300 py-2 px-4">{item.book?.title}</td>
                          <td className="text-slate-300 py-2 px-4">{item.quantity}</td>
                          <td className="text-slate-300 py-2 px-4">${item.price.toFixed(2)}</td>
                          <td className="text-slate-300 py-2 px-4">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Amount Summary</h3>
                <div className="bg-slate-800 rounded p-4 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Discount:</span>
                      <span className="text-green-300">-${selectedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-semibold border-t border-slate-700 pt-2">
                    <span>Final Amount:</span>
                    <span>${selectedOrder.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'completed', 'cancelled', 'refunded'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder._id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded font-medium transition ${
                        selectedOrder.status === status
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
