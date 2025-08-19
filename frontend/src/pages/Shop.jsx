import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const Shop = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          fetch(`/api/products?${new URLSearchParams({
            ...(filters.category && { category: filters.category }),
            ...(filters.collection && { collection: filters.collection }),
            ...(filters.sort && { sort: filters.sort }),
            ...(filters.order && { order: filters.order })
          }).toString()}`),
          fetch('/api/collections')
        ]);
        
        const productsData = await productsRes.json();
        const collectionsData = await collectionsRes.json();
        
        setProducts(productsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the product from the local state
        setProducts(products.filter(product => product._id !== productId));
      } else {
        const error = await response.json();
        alert(`Error deleting product: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      collection: '',
      sort: 'createdAt',
      order: 'desc'
    });
    setSearchParams({});
  };

  const [collections, setCollections] = useState([]);
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'price', label: 'Price' },
    { value: 'name', label: 'Name' }
  ];

  return (
    <div className="shop">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <h1>Shop</h1>
          <p>Discover our collection of modern, elegant clothing</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filters-row">


            <div className="filter-group">
              <label htmlFor="category" className="filter-label">Category</label>
              <select
                id="category"
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="collection" className="filter-label">Collection</label>
              <select
                id="collection"
                className="form-select"
                value={filters.collection}
                onChange={(e) => handleFilterChange('collection', e.target.value)}
              >
                <option value="">All Collections</option>
                {collections.map(collection => (
                  <option key={collection._id} value={collection.name}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort" className="filter-label">Sort By</label>
              <select
                id="sort"
                className="form-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="order" className="filter-label">Order</label>
              <select
                id="order"
                className="form-select"
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="shop-results">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="results-header">
                <p>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
              </div>

              {products.length === 0 ? (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop; 