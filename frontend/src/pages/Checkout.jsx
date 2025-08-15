import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    contactInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          size: item.size,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        contactInfo: formData.contactInfo
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        navigate('/order-success', { state: { orderId: data._id } });
      } else {
        setError(data.message || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Contact Information */}
              <div className="form-section">
                <h2>Contact Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      value={formData.contactInfo.name}
                      onChange={(e) => handleChange('contactInfo', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleChange('contactInfo', 'email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleChange('contactInfo', 'phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h2>Shipping Address</h2>
                <div className="form-group">
                  <label htmlFor="street" className="form-label">Street Address</label>
                  <input
                    type="text"
                    id="street"
                    className="form-input"
                    value={formData.shippingAddress.street}
                    onChange={(e) => handleChange('shippingAddress', 'street', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      className="form-input"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleChange('shippingAddress', 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      id="state"
                      className="form-input"
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleChange('shippingAddress', 'state', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      className="form-input"
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => handleChange('shippingAddress', 'zipCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                      id="country"
                      className="form-select"
                      value={formData.shippingAddress.country}
                      onChange={(e) => handleChange('shippingAddress', 'country', e.target.value)}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large checkout-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cart.map((item, index) => (
                <div key={`${item.product._id}-${item.size}`} className="order-item">
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p>Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 