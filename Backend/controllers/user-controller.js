const { validationResult } = require('express-validator');
const userModel = require('../models/user-model');
const { createUser } = require('../services/user-service');

const blacklistTokenModel = require('../models/blacklist-token-model');


module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await createUser({
      fullname,
      email,
      password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const isuserExists = await userModel.findOne({ email });
  if (!isuserExists) {
    return res.status(401).json({ message: 'User already exists' });
  }

  try {
    const user = await userModel.findOne({email}).select('+password');
    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({ token, user });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getUserProfile = async (req, res, next) => {

  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};