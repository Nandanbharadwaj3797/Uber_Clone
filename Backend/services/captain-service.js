const captainSchema = require('../models/captain-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerCaptain: registerCaptainService } = require('../services/captain-service');
const { validationResult } = require('express-validator');

const registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    color,
    plate,
    capacity,
    vehiclesType
  } = req.body;

  const isCaptainExists = await captainSchema.findOne({ email });
  if (isCaptainExists) {
    return res.status(400).json({ error: 'Captain already exists' });
  }

  const hashedPassword = await captainSchema.hashPassword(password);

  try {
    const captain = await registerCaptainService({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      color,
      plate,
      capacity,
      vehiclesType
    });

    const token = await captain.generateAuthToken();
    res.status(201).json({ token, captain });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerCaptain
};
