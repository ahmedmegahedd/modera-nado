const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/modera-nada', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Create default admin account if it doesn't exist
  try {
    const User = require('./models/User');
    const adminEmail = 'nadodbusiness@gmail.com';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const defaultAdmin = new User({
        name: 'Admin',
        email: adminEmail,
        password: 'nadonado1234',
        isAdmin: true
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin account created successfully');
      console.log('📧 Email: nadodbusiness@gmail.com');
      console.log('🔑 Password: nadonado1234');
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin account:', error.message);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./api/auth'));
app.use('/api/products', require('./api/products'));
app.use('/api/orders', require('./api/orders'));
app.use('/api/inquiries', require('./api/inquiries'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3453;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 