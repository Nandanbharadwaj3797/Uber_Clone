const Captain = require('../models/captain-model');
const { validationResult } = require('express-validator');

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
