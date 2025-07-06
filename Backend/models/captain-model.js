const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    lastname: {
      type: String
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  socketId: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  vehicles: {
    color: { type: String, required: true },
    plate: { type: String, required: true },
    capacity: { type: Number, min: 1, max: 5, required: true },
    vehiclesType: {
      type: String,
      enum: ['car', 'bike', 'Auto'],
      required: true
    }
  },
  location: {
    lat: Number,
    lng: Number
  }
});

// Password hashing
captainSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Password comparison
captainSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Generate JWT token
captainSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1d' }
  );
};

module.exports = mongoose.model('Captain', captainSchema);
