const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// List events with optional filters: q (search v3), category, from, to
router.get('/', async (req, res) => {
  const { q, category, from, to } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  if (q) filter.$text = { $search: q };
  const events = await Event.find(filter).sort({ date: 1 }).limit(200);
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
});

// Create event (admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const ev = await Event.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(ev);
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const ev = await Event.findByIdAndDelete(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json({ ok: true });
});

module.exports = router;
