import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart(product, selectedSize, quantity);
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const getStockForSize = (size) => {
    const stockItem = product.stock.find(item => item.size === size);
    return stockItem ? stockItem.quantity : 0;
  };

  const isSizeAvailable = (size) => {
    return getStockForSize(size) > 0;
  };

  const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP'
  }).format(price);
};

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Left Side - Product Description */}
        <div className="product-description-section">
          <div className="description-content">
            <h2>Product Description</h2>
            <div className="description-text">
              <p>{product.description}</p>
            </div>
            
            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Product Info */}
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Color:</span>
                <span className="info-value">{product.color}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{product.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Product Image */}
        <div className="product-image-section">
          <div className="image-container">
            {product.modelImages && product.modelImages.length > 0 ? (
              <img 
                src={product.modelImages[currentImageIndex]} 
                alt={product.name}
                className="product-main-image"
              />
            ) : product.images && product.images.length > 0 ? (
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="product-main-image"
              />
            ) : (
              <div className="image-placeholder">
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Image Navigation */}
          {(product.modelImages && product.modelImages.length > 1) || (product.images && product.images.length > 1) ? (
            <div className="image-navigation">
              <button 
                className="nav-btn prev"
                onClick={() => {
                  const totalImages = (product.modelImages?.length || 0) + (product.images?.length || 0);
                  setCurrentImageIndex(prev => 
                    prev === 0 ? totalImages - 1 : prev - 1
                  );
                }}
              >
                ‹
              </button>
              <button 
                className="nav-btn next"
                onClick={() => {
                  const totalImages = (product.modelImages?.length || 0) + (product.images?.length || 0);
                  setCurrentImageIndex(prev => 
                    prev === totalImages - 1 ? 0 : prev + 1
                  );
                }}
              >
                ›
              </button>
            </div>
          ) : null}

          {/* Image Thumbnails */}
          {((product.modelImages && product.modelImages.length > 0) || (product.images && product.images.length > 1)) && (
            <div className="image-thumbnails">
              {/* Model Images First */}
              {product.modelImages && product.modelImages.map((image, index) => (
                <button
                  key={`model-${index}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image} alt={`${product.name} Model ${index + 1}`} />
                </button>
              ))}
              {/* Regular Images */}
              {product.images && product.images.map((image, index) => (
                <button
                  key={`regular-${index}`}
                  className={`thumbnail ${(product.modelImages?.length || 0) + index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex((product.modelImages?.length || 0) + index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Info & Purchase */}
        <div className="product-purchase-section">
          <div className="purchase-content">
            {/* Product Name */}
            <h1 className="product-title">{product.name.toUpperCase()}</h1>
            
            {/* Product Price */}
            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            {/* Size Selection */}
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''} ${!isSizeAvailable(size) ? 'out-of-stock' : ''}`}
                    onClick={() => isSizeAvailable(size) && setSelectedSize(size)}
                    disabled={!isSizeAvailable(size)}
                  >
                    {size}
                    {!isSizeAvailable(size) && <span className="x-mark">✕</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>



            {/* Add to Cart Button */}
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedSize || !isSizeAvailable(selectedSize)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 