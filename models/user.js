const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Must be at least 2 characters.'],
    maxlength: [30, 'Must be at less than 30 characters.'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Must be at least 2 characters.'],
    maxlength: [30, 'Must be at less than 30 characters.'],
  },
  avatar: {
    type: String,
    required: true,
    validate: [isURL, 'Не является ссылкой'],
  },
});
module.exports = mongoose.model('user', userSchema);
