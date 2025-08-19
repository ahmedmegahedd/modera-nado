# Email Notification Setup Guide

This guide explains how to set up automatic email notifications for new orders in the Modera Nada e-commerce platform.

## Overview

When a new order is placed, the system automatically sends a detailed email notification to `nadodbusiness@gmail.com` containing:
- Customer information (name, email, phone)
- Complete order details (products, quantities, prices)
- Delivery address
- Order ID and timestamp
- Total amount

## Setup Instructions

### 1. Gmail App Password Setup

Since we're using Gmail SMTP, you'll need to create an App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**c:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Modera Nada Orders"
   - Copy the generated 16-character password

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Edit `backend/.env` and add your email credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### 3. Alternative Email Services

If you prefer not to use Gmail, you can modify the email service to use other providers:

#### Mailtrap (Development/Testing)
```javascript
// In backend/services/emailService.js
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });
};
```

#### SendGrid
```javascript
// In backend/services/emailService.js
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
};
```

## Email Template Features

The email notification includes:

- **Professional HTML layout** with responsive design
- **Complete order summary** with product details
- **Customer contact information**
- **Delivery address formatting**
- **Currency formatting** for prices
- **Order status** and tracking information

## Testing the Email System

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Place a test order** through the frontend

3. **Check the console logs** for email sending confirmation

4. **Verify email delivery** to `nadodbusiness@gmail.com`

## Troubleshooting

### Common Issues

1. **Authentication Error**:
   - Ensure you're using an App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **Email Not Sending**:
   - Check console logs for error messages
   - Verify environment variables are set correctly
   - Ensure the email service is properly imported

3. **Gmail Security**:
   - If using Gmail, you may need to enable "Less secure app access" or use App Passwords
   - Consider using OAuth2 for production environments

### Error Handling

The system is designed to:
- **Not fail order creation** if email sending fails
- **Log email errors** for debugging
- **Continue processing** even with email issues

## Security Considerations

- **Never commit** `.env` files to version control
- **Use App Passwords** instead of regular passwords
- **Rotate credentials** regularly
- **Monitor email logs** for suspicious activity

## Production Recommendations

For production deployment:

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Implement email queuing** for high-volume scenarios
3. **Add email templates** for different order statuses
4. **Set up email monitoring** and alerting
5. **Implement rate limiting** to prevent abuse

## Files Modified

- `backend/services/emailService.js` - Email service implementation
- `backend/api/orders.js` - Integration with order creation
- `backend/env.example` - Environment variables template
- `backend/package.json` - Added nodemailer dependency
