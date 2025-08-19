const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format address
const formatAddress = (shippingAddress) => {
  if (!shippingAddress) return 'Not provided';
  
  const parts = [
    shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.zipCode,
    shippingAddress.country
  ].filter(Boolean);
  
  return parts.join(', ') || 'Not provided';
};

// Send order notification email to admin
const sendOrderNotification = async (order) => {
  try {
    const transporter = createTransporter();
    
    // Format order items
    const itemsList = order.items.map(item => {
      const product = item.product;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${product.name}</strong><br>
            <small>Size: ${item.size}</small>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatCurrency(item.price)}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatCurrency(item.price * item.quantity)}
          </td>
        </tr>
      `;
    }).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
          .order-details { background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background-color: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ New Order Received</h1>
            <p>Order ID: ${order._id}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          
          <div class="order-details">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${order.contactInfo.name}</p>
            <p><strong>Email:</strong> ${order.contactInfo.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${order.contactInfo.phone || 'Not provided'}</p>
            
            <h2>Delivery Address</h2>
            <p>${formatAddress(order.shippingAddress)}</p>
            
            <h2>Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr class="total-row">
                  <td colspan="3" style="padding: 15px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 15px; text-align: right;"><strong>${formatCurrency(order.total)}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <h2>Order Status</h2>
            <p><strong>Status:</strong> <span style="text-transform: capitalize; color: #007bff;">${order.status}</span></p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Modera Nada</p>
            <p>Order ID: ${order._id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'nadodbusiness@gmail.com',
      subject: `New Order #${order._id} - ${order.contactInfo.name}`,
      html: emailHTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order notification email:', error);
    throw error;
  }
};

// Send order confirmation email to customer
const sendOrderConfirmation = async (order) => {
  try {
    // Don't send if customer email is not provided
    if (!order.contactInfo.email) {
      console.log('No customer email provided, skipping confirmation email');
      return;
    }

    const transporter = createTransporter();
    
    // Format order items
    const itemsList = order.items.map(item => {
      const product = item.product;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${product.name}</strong><br>
            <small>Size: ${item.size}</small>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatCurrency(item.price)}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatCurrency(item.price * item.quantity)}
          </td>
        </tr>
      `;
    }).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; padding: 30px; text-align: center; border-radius: 10px; color: white; }
          .order-details { background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background-color: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .status-badge { display: inline-block; padding: 5px 15px; background-color: #4CAF50; color: white; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your purchase, ${order.contactInfo.name}!</p>
            <p>Your order has been successfully placed and is being processed.</p>
          </div>
          
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status-badge">${order.status}</span></p>
            
            <h2>Shipping Address</h2>
            <p>${formatAddress(order.shippingAddress)}</p>
            
            <h2>Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr class="total-row">
                  <td colspan="3" style="padding: 15px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 15px; text-align: right;"><strong>${formatCurrency(order.total)}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <h2>What's Next?</h2>
            <ul>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive tracking information once your order ships</li>
              <li>If you have any questions, please contact us at nadodbusiness@gmail.com</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Modera Nada!</p>
            <p>Order ID: ${order._id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.contactInfo.email,
      subject: `Order Confirmation #${order._id} - Modera Nada`,
      html: emailHTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to customer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderNotification,
  sendOrderConfirmation
};
