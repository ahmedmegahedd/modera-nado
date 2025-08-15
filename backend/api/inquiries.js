const express = require('express');
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');

const router = express.Router();

// Submit inquiry (public)
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    const inquiry = new Inquiry({
      name,
      email,
      message
    });

    await inquiry.save();

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        createdAt: inquiry.createdAt
      }
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 