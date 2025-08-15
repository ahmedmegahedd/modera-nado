import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=6');
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
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
              <Link to="/policies" className="btn btn-secondary btn-large">
                Learn More
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

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our diverse range of clothing categories</p>
          </div>

          <div className="categories-grid">
            <Link to="/shop?category=Tops" className="category-card">
              <div className="category-image">
                <div className="category-placeholder">Tops</div>
              </div>
              <h3>Tops</h3>
            </Link>
            <Link to="/shop?category=Bottoms" className="category-card">
              <div className="category-image">
                <div className="category-placeholder">Bottoms</div>
              </div>
              <h3>Bottoms</h3>
            </Link>
            <Link to="/shop?category=Dresses" className="category-card">
              <div className="category-image">
                <div className="category-placeholder">Dresses</div>
              </div>
              <h3>Dresses</h3>
            </Link>
            <Link to="/shop?category=Outerwear" className="category-card">
              <div className="category-image">
                <div className="category-placeholder">Outerwear</div>
              </div>
              <h3>Outerwear</h3>
            </Link>
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
              <Link to="/policies" className="btn btn-primary">
                View Our Policies
              </Link>
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