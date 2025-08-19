import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="order-success">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
          
          {orderId && (
            <div className="order-details">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p>We'll send you an email confirmation with order details and tracking information.</p>
            </div>
          )}
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You'll receive an email confirmation shortly</li>
              <li>We'll process your order and ship it within 1-2 business days</li>
              <li>You'll get tracking information once your order ships</li>
            </ul>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/shop')} 
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
