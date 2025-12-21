const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  vaccineName: {
    type: String,
    required: [true, 'Please add a vaccine name'],
    trim: true,
    maxlength: [50, 'Vaccine name cannot be more than 50 characters']
  },
  vaccinationDate: {
    type: Date,
    required: [true, 'Please add a vaccination date']
  },
  nextDueDate: {
    type: Date,
    required: [true, 'Please add a next due date']
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

module.exports = mongoose.model('Vaccination', vaccinationSchema);