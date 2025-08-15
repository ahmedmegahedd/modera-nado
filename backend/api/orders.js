const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL']).withMessage('Invalid size'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('contactInfo').isObject().withMessage('Contact info is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, contactInfo } = req.body;

    // Validate products and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      // Check stock availability
      const stockItem = product.stock.find(s => s.size === item.size);
      if (!stockItem || stockItem.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name} in size ${item.size}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress,
      contactInfo
    });

    await order.save();

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stock.$[elem].quantity': -item.quantity }
      }, {
        arrayFilters: [{ 'elem.size': item.size }]
      });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 