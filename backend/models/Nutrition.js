const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  feedType: {
    type: String,
    required: [true, 'Please add a feed type'],
    trim: true,
    maxlength: [50, 'Feed type cannot be more than 50 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
    enum: ['kg', 'lbs', 'grams', 'liters', 'ml'],
    default: 'kg'
  },
  frequency: {
    type: String,
    required: [true, 'Please add a frequency'],
    enum: ['daily', 'weekly', 'monthly', 'as needed'],
    default: 'daily'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nutrition', nutritionSchema);