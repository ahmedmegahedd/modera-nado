import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAdmin } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=6'),
          fetch('/api/collections')
        ]);
        
        const productsData = await productsRes.json();
        const collectionsData = await collectionsRes.json();
        
        setFeaturedProducts(productsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to MODÈRA</h1>
            <p>Discover our curated collection of contemporary clothing designed for the modern individual who values both style and comfort.</p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary btn-large">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Collection</h2>
            <p>Discover our most popular pieces, carefully selected for their quality and style.</p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-primary btn-large">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Collections</h2>
            <p>Discover our carefully curated fashion collections</p>
          </div>

          <div className="collections-grid">
            {collections.map(collection => (
              <Link key={collection._id} to={`/shop?collection=${encodeURIComponent(collection.name)}`} className="collection-card">
                <div className="collection-image">
                  {collection.image ? (
                    <img src={collection.image} alt={collection.name} />
                  ) : (
                    <div className="collection-placeholder">{collection.name}</div>
                  )}
                </div>
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
              </Link>
            ))}
            
            {isAdmin && (
              <div className="collection-card add-collection">
                <div className="collection-image">
                  <div className="collection-placeholder add-icon">+</div>
                </div>
                <h3>Add New Collection</h3>
                <p>Create a new collection to showcase your latest designs</p>
                <button className="btn btn-secondary" onClick={() => window.location.href = '/admin'}>
                  Create Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Store Policies</h2>
              <p>We believe in creating clothing that speaks to the modern individual. Our designs combine contemporary aesthetics with timeless elegance, ensuring that each piece is not just fashionable but also comfortable and durable.</p>
              <p>From our carefully selected fabrics to our attention to detail in every stitch, we strive to deliver quality that exceeds expectations.</p>
            </div>
            <div className="about-image">
              <div className="about-placeholder">Our Story</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 