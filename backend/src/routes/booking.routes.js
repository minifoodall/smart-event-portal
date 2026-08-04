const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  const { eventId, tickets = 1 } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.capacity < tickets) return res.status(400).json({ message: 'Not enough capacity' });
  event.capacity -= tickets;
  await event.save();
  const booking = await Booking.create({ user: req.user.id, event: eventId, tickets });
  res.status(201).json(booking);
});

router.get('/my', async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('event');
  res.json(bookings);
});

router.delete('/:id', async (req, res) => {
  const b = await Booking.findOne({ _id: req.params.id, user: req.user.id });
  if (!b) return res.status(404).json({ message: 'Booking not found' });
  if (b.status === 'cancelled') return res.json(b);
  b.status = 'cancelled';
  await b.save();
  await Event.findByIdAndUpdate(b.event, { $inc: { capacity: b.tickets } });
  res.json(b);
});

module.exports = router;
