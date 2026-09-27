const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());

const mongoose = require('mongoose');

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    database: dbStatus
  });
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Fallback 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Server Initialization
const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`[Server] Portfolio backend running on port ${PORT}`);
  });
  return server;
};

startServer();

module.exports = { app, server };
