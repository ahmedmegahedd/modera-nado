import React, { useState, useEffect } from 'react';
import './CollectionForm.css';

const CollectionForm = ({ collection, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || ''
      });
      setImagePreview(collection.image || '');
    }
  }, [collection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (image) {
        formDataToSend.append('image', image);
        console.log('Image file:', image.name, image.size);
      } else {
        console.log('No image selected');
      }

      const url = collection ? `/api/collections/${collection._id}` : '/api/collections';
      const method = collection ? 'PUT' : 'POST';
      
      console.log('Submitting to:', url, 'Method:', method);

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.errors) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          throw new Error(`Validation error: ${errorMessages}`);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`Failed to save collection (${response.status})`);
        }
      }

      const savedCollection = await response.json();
      onSubmit(savedCollection);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="collection-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{collection ? 'Edit Collection' : 'Create New Collection'}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-grid">
        <div className="form-section">
          <h4>Collection Information</h4>
          
          <div className="form-group">
            <label htmlFor="name">Collection Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Summer Collection"
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
              placeholder="Describe your collection..."
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Collection Image</h4>
          
          <div className="image-upload-section">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Collection preview" />
              ) : (
                <div className="image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <p>No image selected</p>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="image" className="file-input-label">
                {collection ? 'Change Image' : 'Upload Image *'}
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                required={!collection}
              />
              <p className="file-help">Recommended: 800x600px or larger, JPG, PNG, or WebP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (collection ? 'Update Collection' : 'Create Collection')}
        </button>
      </div>
    </form>
  );
};

export default CollectionForm;
