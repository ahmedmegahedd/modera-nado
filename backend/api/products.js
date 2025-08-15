const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const products = await Product.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 });
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'modelImages', maxCount: 5 }
]), [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories']).withMessage('Invalid category'),
  body('sizes').notEmpty().withMessage('Sizes are required'),
  body('color').trim().isLength({ min: 1 }).withMessage('Color is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, sizes, featured, color, features } = req.body;
    
    // Process uploaded images
    const images = req.files && req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
    const modelImages = req.files && req.files.modelImages ? req.files.modelImages.map(file => `/uploads/${file.filename}`) : [];
    
    // Create stock array from sizes
    const parsedSizes = JSON.parse(sizes);
    const stock = parsedSizes.map(size => ({
      size,
      quantity: 0
    }));

    // Parse features array
    const featuresArray = features ? JSON.parse(features) : [];

    const product = new Product({
      name,
      description,
      features: featuresArray,
      images,
      modelImages,
      sizes: JSON.parse(sizes),
      category,
      price: parseFloat(price),
      color,
      stock,
      featured: featured === 'true'
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'modelImages', maxCount: 5 }
]), [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories']).withMessage('Invalid category'),
  body('color').trim().isLength({ min: 1 }).withMessage('Color is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, sizes, featured, color, features, stock } = req.body;
    
    // Handle new images if uploaded
    let images = product.images;
    if (req.files && req.files.images && req.files.images.length > 0) {
      const newImages = req.files.images.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Handle new model images if uploaded
    let modelImages = product.modelImages || [];
    if (req.files && req.files.modelImages && req.files.modelImages.length > 0) {
      const newModelImages = req.files.modelImages.map(file => `/uploads/${file.filename}`);
      modelImages = [...modelImages, ...newModelImages];
    }

    // Parse features array
    const featuresArray = features ? JSON.parse(features) : [];

    product.name = name;
    product.description = description;
    product.features = featuresArray;
    product.price = parseFloat(price);
    product.category = category;
    product.color = color;
    product.images = images;
    product.modelImages = modelImages;
    product.featured = featured === 'true';
    
    if (sizes) {
      product.sizes = JSON.parse(sizes);
    }

    // Handle stock data
    if (stock) {
      product.stock = JSON.parse(stock);
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock (admin only)
router.patch('/:id/stock', adminAuth, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock = stock;
    await product.save();
    
    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 