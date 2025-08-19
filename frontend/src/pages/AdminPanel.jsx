import React, { useState, useEffect } from 'react';
import AdminProductForm from '../components/AdminProductForm';
import CollectionForm from '../components/CollectionForm';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, collectionsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/collections'),
        fetch('/api/orders/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json();
        setCollections(collectionsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (savedProduct) => {
    setShowProductForm(false);
    setEditingProduct(null);
    setError('');
    await fetchData();
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setError('');
  };

  const handleCollectionSubmit = async (savedCollection) => {
    setShowCollectionForm(false);
    setEditingCollection(null);
    setError('');
    await fetchData();
  };

  const handleCollectionCancel = () => {
    setShowCollectionForm(false);
    setEditingCollection(null);
    setError('');
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchData();
      } else {
        setError('Failed to delete collection');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setShowCollectionForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchData();
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData();
      } else {
        setError('Failed to update order status');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP'
  }).format(price);
};

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage products and orders</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Manage Products</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                Add New Product
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="product-form-container">
                <AdminProductForm
                  product={editingProduct}
                  onSubmit={handleProductSubmit}
                  onCancel={handleProductCancel}
                />
              </div>
            )}

            {/* Products List */}
            <div className="products-list">
              <h3>All Products</h3>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.category}</p>
                      <p>{formatPrice(product.price)}</p>
                      <div className="product-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="collections-section">
            <div className="section-header">
              <h2>Manage Collections</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingCollection(null);
                  setShowCollectionForm(true);
                }}
              >
                Add New Collection
              </button>
            </div>

            {/* Collection Form */}
            {showCollectionForm && (
              <div className="collection-form-container">
                <CollectionForm
                  collection={editingCollection}
                  onSubmit={handleCollectionSubmit}
                  onCancel={handleCollectionCancel}
                />
              </div>
            )}

            {/* Collections List */}
            <div className="collections-list">
              <h3>All Collections</h3>
              <div className="collections-grid">
                {collections.map(collection => (
                  <div key={collection._id} className="collection-card">
                    <div className="collection-image">
                      {collection.image ? (
                        <img src={collection.image} alt={collection.name} />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="collection-info">
                      <h4>{collection.name}</h4>
                      <p>{collection.description}</p>
                      <div className="collection-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditCollection(collection)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleDeleteCollection(collection._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Manage Orders</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.contactInfo?.name}</p>
                    <p><strong>Email:</strong> {order.contactInfo?.email}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.product.name} - {item.size} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 