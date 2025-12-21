const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  tagId: {
    type: String,
    required: [true, 'Please add a tag ID'],
    unique: true,
    trim: true,
    maxlength: [20, 'Tag ID cannot be more than 20 characters']
  },
  species: {
    type: String,
    required: [true, 'Please add a species'],
    trim: true,
    maxlength: [30, 'Species cannot be more than 30 characters']
  },
  breed: {
    type: String,
    required: [true, 'Please add a breed'],
    trim: true,
    maxlength: [30, 'Breed cannot be more than 30 characters']
  },
  age: {
    type: Number,
    required: [true, 'Please add an age'],
    min: [0, 'Age cannot be negative']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Animal', animalSchema);