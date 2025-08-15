import React from 'react';
import './Policies.css';

const Policies = () => {
  return (
    <div className="policies-page">
      <div className="container">
        {/* Hero Section */}
        <section className="policies-hero">
          <h1>Store Policies</h1>
          <p>Everything you need to know about shopping with MODÈRA</p>
        </section>

        {/* Return Policy Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Return Policy</h2>
              <p>
                We want you to love your MODÈRA pieces. If you're not completely satisfied with your purchase, 
                you can return it within 30 days of delivery for a full refund or exchange.
              </p>
              <h3>Return Conditions:</h3>
              <ul>
                <li>Items must be unworn, unwashed, and in original condition</li>
                <li>All original tags and packaging must be attached</li>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Sale items are final sale and cannot be returned</li>
              </ul>
              <h3>How to Return:</h3>
              <ol>
                <li>Contact our customer service team</li>
                <li>Provide your order number and reason for return</li>
                <li>We'll provide you with a return shipping label</li>
                <li>Package your item securely and ship it back</li>
                <li>Refunds will be processed within 5-7 business days</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Shipping Information Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Shipping Information</h2>
              <p>
                We offer fast and reliable shipping to ensure your MODÈRA pieces arrive safely and on time.
              </p>
              <h3>Shipping Options:</h3>
              <ul>
                <li><strong>Standard Shipping:</strong> 5-7 business days - $8.99</li>
                <li><strong>Express Shipping:</strong> 2-3 business days - $15.99</li>
                <li><strong>Overnight Shipping:</strong> Next business day - $25.99</li>
                <li><strong>Free Shipping:</strong> On orders over $150</li>
              </ul>
              <h3>Shipping Details:</h3>
              <ul>
                <li>Orders placed before 2 PM EST ship the same day</li>
                <li>You'll receive tracking information via email</li>
                <li>International shipping available to select countries</li>
                <li>Customs duties may apply for international orders</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Care Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Product Care</h2>
              <p>
                Proper care ensures your MODÈRA pieces maintain their beauty and longevity. 
                Follow these care instructions to keep your garments looking their best.
              </p>
              <h3>General Care Tips:</h3>
              <ul>
                <li>Always check the care label before washing</li>
                <li>Wash similar colors together</li>
                <li>Use gentle detergents and avoid fabric softeners</li>
                <li>Air dry when possible to preserve fabric quality</li>
                <li>Store garments in a cool, dry place</li>
              </ul>
              <h3>Fabric-Specific Care:</h3>
              <ul>
                <li><strong>Cotton:</strong> Machine wash cold, tumble dry low</li>
                <li><strong>Silk:</strong> Dry clean or hand wash cold</li>
                <li><strong>Wool:</strong> Dry clean or hand wash cold</li>
                <li><strong>Linen:</strong> Machine wash cold, air dry</li>
                <li><strong>Polyester:</strong> Machine wash cold, tumble dry low</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Size Guide Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Size Guide</h2>
              <p>
                Finding the perfect fit is essential. Use our size guide to ensure you select 
                the right size for your MODÈRA pieces.
              </p>
              <h3>How to Measure:</h3>
              <ul>
                <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                <li><strong>Waist:</strong> Measure around your natural waistline</li>
                <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
                <li><strong>Inseam:</strong> Measure from crotch to desired length</li>
              </ul>
              <h3>Size Chart:</h3>
              <div className="size-chart">
                <table>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest (inches)</th>
                      <th>Waist (inches)</th>
                      <th>Hips (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XS</td>
                      <td>32-34</td>
                      <td>26-28</td>
                      <td>34-36</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>34-36</td>
                      <td>28-30</td>
                      <td>36-38</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>36-38</td>
                      <td>30-32</td>
                      <td>38-40</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>38-40</td>
                      <td>32-34</td>
                      <td>40-42</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>40-42</td>
                      <td>34-36</td>
                      <td>42-44</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Privacy Policy</h2>
              <p>
                Your privacy is important to us. This policy explains how we collect, use, 
                and protect your personal information.
              </p>
              <h3>Information We Collect:</h3>
              <ul>
                <li>Name, email address, and shipping information</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Order history and preferences</li>
                <li>Website usage data and analytics</li>
              </ul>
              <h3>How We Use Your Information:</h3>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders</li>
                <li>Send you updates about new products and promotions (with your consent)</li>
                <li>Improve our website and customer experience</li>
                <li>Comply with legal obligations</li>
              </ul>
              <h3>Data Protection:</h3>
              <ul>
                <li>We use industry-standard security measures to protect your data</li>
                <li>We never sell or share your personal information with third parties</li>
                <li>You can request access to or deletion of your data at any time</li>
                <li>We comply with all applicable data protection laws</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="policy-section">
          <div className="policy-content">
            <div className="policy-text">
              <h2>Contact Us</h2>
              <p>
                Have questions about our policies? We're here to help!
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> support@modera.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Policies; 