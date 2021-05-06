const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }
});

module.exports = User = mongoose.model('users', UserSchema);
