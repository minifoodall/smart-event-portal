// Smart Event Management Portal - Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Security & utilities
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

// API metadata
app.locals.version = process.env.APP_VERSION || '1.0.0';

// Health & readiness probes (for Kubernetes)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: app.locals.version, uptime: process.uptime() });
});
app.get('/api/ready', (_req, res) => {
  const mongooseState = require('mongoose').connection.readyState; // 1 == connected
  if (mongooseState !== 1) return res.status(503).json({ status: 'not-ready' });
  res.json({ status: 'ready' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 + global error handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT} v${app.locals.version}`));
  });
}

module.exports = app;
