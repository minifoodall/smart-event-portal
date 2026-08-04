const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'general' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Text index for v3 event search feature
EventSchema.index({ title: 'text', description: 'text', location: 'text', category: 'text' });

module.exports = mongoose.model('Event', EventSchema);
