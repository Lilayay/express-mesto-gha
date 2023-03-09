const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Must be at least 2 characters.'],
    maxlength: [30, 'Must be at less than 30 characters.'],
  },
  link: {
    type: String,
    required: true,
    validate: [isURL, 'Не является ссылкой'],
  },
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    default: Array,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);
