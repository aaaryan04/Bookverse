import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cartAPI, orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Error loading cart');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId, quantity) => {
    try {
      if (quantity < 1) return;
      const response = await cartAPI.updateCartItem(bookId, { quantity });
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Error updating cart');
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      const response = await cartAPI.removeFromCart(bookId);
      setCart(response.data.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items.length) return 0;
    return cart.items.reduce((total, item) => total + item.priceAtAdding * item.quantity, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!shippingData.street || !shippingData.city) {
      toast.error('Please fill in all shipping details');
      return;
    }

    try {
      const response = await orderAPI.createOrder({
        paymentMethod: 'credit_card',
        shippingAddress: shippingData,
      });
      toast.success('Order created successfully!');
      navigate(`/order-confirmation/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating order');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div
        className={`min-h-screen transition ${isDark ? 'bg-slate-900' : 'bg-white'}`}
      >
        <div className="container-custom py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/books')}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div
      className={`min-h-screen transition ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}
    >
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-lg p-6 ${
                isDark
                  ? 'bg-slate-800 text-white'
                  : 'bg-white'
              }`}
            >
              {cart.items.map((item) => (
                <div
                  key={item.book._id}
                  className={`flex gap-6 py-6 border-b last:border-b-0 ${
                    isDark ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-20 h-32 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{item.book.title}</h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {item.book.author}
                    </p>
                    <p className="text-indigo-600 font-bold mt-2">
                      ${item.priceAtAdding}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.book._id, item.quantity - 1)
                        }
                        className={`p-1 rounded ${
                          isDark
                            ? 'hover:bg-slate-700'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <FiMinus />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.book._id, item.quantity + 1)
                        }
                        className={`p-1 rounded ${
                          isDark
                            ? 'hover:bg-slate-700'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600">
                      ${(item.priceAtAdding * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.book._id)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout */}
          <div
            className={`rounded-lg p-6 h-fit ${
              isDark
                ? 'bg-slate-800 text-white'
                : 'bg-white'
            }`}
          >
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b">
              {cart.items.map((item) => (
                <div key={item.book._id} className="flex justify-between text-sm">
                  <span>
                    {item.book.title} x{item.quantity}
                  </span>
                  <span className="font-bold">
                    ${(item.priceAtAdding * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold">FREE</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutStep === 1 ? (
              <button
                onClick={() => setCheckoutStep(2)}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingData.street}
                    onChange={(e) =>
                      setShippingData({...shippingData, street: e.target.value})
                    }
                    className={`w-full px-3 py-2 border rounded text-black text-sm`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData({...shippingData, city: e.target.value})
                      }
                      className={`w-full px-3 py-2 border rounded text-black text-sm`}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) =>
                        setShippingData({...shippingData, zipCode: e.target.value})
                      }
                      className={`w-full px-3 py-2 border rounded text-black text-sm`}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                >
                  Complete Order
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="w-full py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
