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
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')).filter(Boolean)
  : [];

const localOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000'
];

// Matches production and preview Vercel deployments for this personal portfolio
const vercelPattern = /^https:\/\/(personal-portfolio(-[a-z0-9-]+)?-sunshriya-portfolio|personal-portfolio(-[a-z0-9-]+)?)\.vercel\.app$/i;

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;
  if (localOrigins.includes(origin)) return true;
  if (vercelPattern.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());

const mongoose = require('mongoose');

// Root Endpoint for deployment verification
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio Backend API is running'
  });
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI) {
    await connectDB().catch(() => {});
  }
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

// Only listen directly when running in a standalone Node process (not in serverless/Vercel)
if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.app = app;
module.exports.startServer = startServer;
