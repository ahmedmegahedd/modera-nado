import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const { isAdmin } = useAuth();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product._id);
    }
  };

  return (
    <div className="product-display">
      <Link to={`/product/${product._id}`} className="product-link">
        {product.images && product.images.length > 0 && (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="product-image"
          />
        )}
        
        <div className="product-text">
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
      </Link>
      
      {isAdmin && (
        <button 
          onClick={handleDelete}
          className="delete-btn"
          title="Delete Product"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ProductCard; 