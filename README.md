# MODÈRA - Modern Clothing E-commerce

A modern, elegant e-commerce platform for clothing with admin panel and image management.

## Features

### 🛍️ Customer Features
- **Modern Product Display**: Standing model photos with seamless background integration
- **Responsive Shop**: Grid layout with filtering and search capabilities
- **Shopping Cart**: Persistent cart with checkout functionality
- **Product Details**: Detailed product pages with multiple image views
- **Contact & Policies**: Customer support and information pages

### 👨‍💼 Admin Features
- **Product Management**: Complete CRUD operations for products
- **Image Upload System**: 
  - **Product Images**: Multiple product photos (up to 5 images)
  - **Model Photos**: Full-body model images for 3D display effect
  - **Preview System**: Real-time image preview before upload
  - **File Validation**: Supports JPG, PNG, WebP formats (5MB max)
- **Order Management**: Track and update order statuses
- **Inventory Control**: Manage product sizes and stock levels
- **Email Notifications**: Automatic order notifications sent to nadodbusiness@gmail.com

## Image Upload System

### Product Images
- Upload up to 5 product images per item
- First image becomes the main product image
- Images are stored in `/backend/uploads/` directory
- Served statically via `/uploads/` endpoint

### Model Photos (3D Display)
- Special section for full-body model photos
- Designed for white background images
- Displayed with premium 3D effects on product pages
- Perfect for showcasing clothing on models

### Upload Process
1. **Select Files**: Click upload buttons to select images
2. **Preview**: See real-time previews of selected images
3. **Reorder**: First image becomes the main product image
4. **Remove**: Click × to remove unwanted images
5. **Submit**: Images are uploaded with product data

## Technical Stack

### Frontend
- **React**: Modern UI with hooks and context
- **CSS**: Custom styling with responsive design
- **Fonts**: Inter + Playfair Display for typography

### Backend
- **Node.js + Express**: RESTful API
- **MongoDB + Mongoose**: Database and ODM
- **Multer**: File upload handling
- **JWT**: Authentication system
- **Express Validator**: Input validation
- **Nodemailer**: Email notifications for orders

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your email credentials (see EMAIL_SETUP_GUIDE.md)
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Admin Access
- **Email**: nadodbusiness@gmail.com
- **Password**: nadonado1234

## File Structure

```
├── backend/
│   ├── api/
│   │   ├── products.js    # Product CRUD + image upload
│   │   ├── orders.js      # Order management
│   │   └── auth.js        # Authentication
│   ├── models/
│   │   └── Product.js     # Product schema with images
│   ├── uploads/           # Image storage directory
│   └── server.js          # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx      # Product display
│   │   │   └── AdminProductForm.jsx # Image upload form
│   │   └── pages/
│   │       ├── Shop.jsx             # Product listing
│   │       └── AdminPanel.jsx       # Admin dashboard
│   └── public/
│       └── index.html               # Font imports
```

## Image Upload API Endpoints

### Create Product with Images
```
POST /api/products
Content-Type: multipart/form-data

Fields:
- name: string
- description: string
- price: number
- category: string
- color: string
- sizes: JSON array
- features: JSON array
- featured: boolean
- images: file[] (up to 5)
- modelImages: file[] (up to 5)
```

### Update Product with Images
```
PUT /api/products/:id
Content-Type: multipart/form-data

Same fields as create, new images are appended to existing ones
```

## Styling Features

### Product Cards
- **Standing Model Design**: Tall images (500px height) with no borders
- **Seamless Background**: Matches site background (#f5f5f5)
- **Hover Effects**: Subtle scale and zoom animations
- **Typography**: Playfair Display serif font for elegance

### Admin Form
- **Drag & Drop**: Visual file selection interface
- **Preview Grid**: Real-time image previews
- **Validation**: File type and size validation
- **Responsive**: Works on all device sizes

## Security Features

- **File Validation**: Only image files allowed
- **Size Limits**: 5MB maximum per file
- **Admin Authentication**: JWT-based admin access
- **Rate Limiting**: API request throttling
- **Input Sanitization**: Express validator protection

## Email Notifications

The system automatically sends detailed email notifications to `nadodbusiness@gmail.com` when new orders are placed. Each email includes:

- Customer information (name, email, phone)
- Complete order details with products and prices
- Delivery address
- Order ID and timestamp
- Professional HTML formatting

See `EMAIL_SETUP_GUIDE.md` for detailed setup instructions.

## Future Enhancements

- [ ] Image compression and optimization
- [ ] Cloud storage integration (AWS S3)
- [ ] Image cropping and editing tools
- [ ] Bulk image upload
- [ ] Image alt text management
- [ ] CDN integration for faster loading
- [ ] Customer order confirmation emails
- [ ] Order status update notifications 