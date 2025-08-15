import React, { useState, useEffect } from 'react';
import './AdminProductForm.css';

const AdminProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    color: '',
    sizes: [],
    features: [],
    featured: false
  });
  const [stockData, setStockData] = useState({});
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [modelImageFiles, setModelImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        color: product.color || '',
        sizes: product.sizes || [],
        features: product.features || [],
        featured: product.featured || false
      });
      
      // Initialize stock data from existing product
      const initialStock = {};
      if (product.stock && product.stock.length > 0) {
        product.stock.forEach(item => {
          initialStock[item.size] = item.quantity || 0;
        });
      }
      setStockData(initialStock);
      
      setImages(product.images || []);
      setModelImages(product.modelImages || []);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
    
    // Initialize stock quantity for new size
    if (!formData.sizes.includes(size) && !stockData[size]) {
      setStockData(prev => ({
        ...prev,
        [size]: 0
      }));
    }
  };

  const handleStockChange = (size, quantity) => {
    setStockData(prev => ({
      ...prev,
      [size]: Math.max(0, parseInt(quantity) || 0)
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleModelImageChange = (e) => {
    const files = Array.from(e.target.files);
    setModelImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setModelImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeModelImage = (index) => {
    setModelImages(prev => prev.filter((_, i) => i !== index));
    setModelImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('sizes', JSON.stringify(formData.sizes));
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('featured', formData.featured);

      // Create stock array with quantities
      const stock = formData.sizes.map(size => ({
        size,
        quantity: stockData[size] || 0
      }));
      formDataToSend.append('stock', JSON.stringify(stock));

      // Add new image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Add new model image files
      modelImageFiles.forEach(file => {
        formDataToSend.append('modelImages', file);
      });

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.errors) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          throw new Error(`Validation error: ${errorMessages}`);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`Failed to save product (${response.status})`);
        }
      }

      const savedProduct = await response.json();
      onSubmit(savedProduct);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-grid">
        {/* Basic Information */}
        <div className="form-section">
          <h4>Basic Information</h4>
          
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color *</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="form-section">
          <h4>Features</h4>
          <div className="features-list">
            {formData.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="add-feature-btn"
            >
              + Add Feature
            </button>
          </div>
        </div>

        {/* Sizes and Stock */}
        <div className="form-section">
          <h4>Available Sizes & Stock</h4>
          <div className="size-stock-container">
            <div className="size-checkboxes">
              {availableSizes.map(size => (
                <label key={size} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
            
            {formData.sizes.length > 0 && (
              <div className="stock-management">
                <h5>Stock Quantities</h5>
                <div className="stock-grid">
                  {formData.sizes.map(size => (
                    <div key={size} className="stock-item">
                      <label htmlFor={`stock-${size}`}>{size}</label>
                      <input
                        type="number"
                        id={`stock-${size}`}
                        value={stockData[size] || 0}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        min="0"
                        placeholder="0"
                      />
                      <span className="stock-status">
                        {stockData[size] > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Images */}
        <div className="form-section">
          <h4>Product Images</h4>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              id="images"
            />
            <label htmlFor="images" className="upload-label">
              📷 Choose Product Images
            </label>
            <p className="upload-hint">
              <strong>💡 For best results:</strong> Use PNG images with transparent backgrounds. 
              This creates seamless standing model display. 
              Supported formats: PNG (recommended), JPG, GIF.
            </p>
          </div>

          {images.length > 0 && (
            <div className="image-preview">
              <div className="preview-header">
                <span>Image Preview ({images.length} selected)</span>
                <small>First image will be the main product image</small>
              </div>
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <div className="image-number">{index + 1}</div>
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model Images */}
        <div className="form-section">
          <h4>Model Photos (3D Display)</h4>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleModelImageChange}
              id="modelImages"
            />
            <label htmlFor="modelImages" className="upload-label">
              👗 Choose Model Photos
            </label>
            <p className="upload-hint">
              <strong>🎯 Perfect for standing model display:</strong> Upload full-body model photos with transparent backgrounds. 
              PNG format recommended for seamless integration with the studio background.
            </p>
          </div>

          {modelImages.length > 0 && (
            <div className="image-preview">
              <div className="preview-header">
                <span>Model Photo Preview ({modelImages.length} selected)</span>
                <small>These will be displayed with 3D effects</small>
              </div>
              <div className="image-preview-grid">
                {modelImages.map((image, index) => (
                  <div key={index} className="image-item model-image-item">
                    <div className="image-number">{index + 1}</div>
                    <img src={image} alt={`Model Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeModelImage(index)}
                      className="remove-image-btn"
                      title="Remove model image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
};

export default AdminProductForm; 