const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    match: /((http)|(https)):\/\/.+\..+/,
  },
  trailer: {
    type: String,
    required: true,
    match: /((http)|(https)):\/\/.+\..+/,
  },
  thumbnail: {
    type: String,
    required: true,
    match: /((http)|(https)):\/\/.+\..+/,
  },
  owner: {
    required: false,
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  nameRU: {
    unique: true,
    type: String,
    required: true,
  },
  nameEN: {
    unique: true,
    type: String,
    required: true,
  },
  movieId: {
    unique: true,
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
