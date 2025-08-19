const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'collection-' + Date.now() + path.extname(file.originalname));
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

// Get all collections (public)
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.json(collections);
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single collection (public)
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create collection (admin only)
router.post('/', adminAuth, upload.single('image'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], async (req, res) => {
  try {
    console.log('Collection creation request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Collection image is required' });
    }

    const { name, description } = req.body;
    const image = `/uploads/${req.file.filename}`;

    // Check if collection name already exists
    const existingCollection = await Collection.findOne({ name });
    if (existingCollection) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }

    const collection = new Collection({
      name,
      description,
      image
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update collection (admin only)
router.put('/:id', adminAuth, upload.single('image'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const { name, description } = req.body;

    // Check if collection name already exists (excluding current collection)
    const existingCollection = await Collection.findOne({ name, _id: { $ne: req.params.id } });
    if (existingCollection) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }

    collection.name = name;
    collection.description = description;

    // Update image if new one is uploaded
    if (req.file) {
      collection.image = `/uploads/${req.file.filename}`;
    }

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete collection (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Instead of deleting, mark as inactive
    collection.isActive = false;
    await collection.save();

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
