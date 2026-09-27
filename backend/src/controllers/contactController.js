const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Contact = require('../models/Contact');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc   Submit contact message
 * @route  POST /api/contact
 * @access Public
 */
const createContact = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const { name, email, message } = req.body;

    // Explicit request body validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Ensure database connection is active before creating document
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
      if (mongoose.connection.readyState !== 1) {
        const dbErr = new Error('Database connection is not ready. Please verify MongoDB Atlas network connectivity.');
        dbErr.statusCode = 503;
        throw dbErr;
      }
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact
};
