const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

const router = express.Router();
router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
});

router.get('/stats', async (_req, res) => {
  const [users, events, bookings] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Booking.countDocuments(),
  ]);
  res.json({ users, events, bookings });
});

module.exports = router;
