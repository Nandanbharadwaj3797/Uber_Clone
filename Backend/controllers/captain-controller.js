const Captain = require('../models/captain-model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklist-token-model');

exports.registerCaptain = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, email, password, vehicles } = req.body;

  try {
    // Check if captain already exists
    const existingCaptain = await Captain.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ error: 'Captain already exists' });
    }

    // Hash password
    const hashedPassword = await Captain.hashPassword(password);

    // Create and save new captain
    const newCaptain = new Captain({
      fullname,
      email,
      password: hashedPassword,
      vehicles,
      socketId: `socket_${Date.now()}` // dummy socket ID for now
    });

    await newCaptain.save();

    // Generate JWT token
    const token = newCaptain.generateAuthToken();

    // Return success response
    res.status(201).json({
      message: 'Captain registered successfully',
      token,
      captain: {
        id: newCaptain._id,
        fullname: newCaptain.fullname,
        email: newCaptain.email,
        vehicles: newCaptain.vehicles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.loginCaptain = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email }).select('+password');
    if (!captain) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = captain.generateAuthToken();

    res.cookie('token',token);
    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain._id).select('-password');
    if (!captain) {
      return res.status(404).json({ error: 'Captain not found' });
    }
    res.status(200).json(captain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  await blacklistTokenModel.create({ token }); // Blacklist the token
  // Clear the cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};