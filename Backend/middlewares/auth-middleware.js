const userModel = require('../models/user-model');
const captainModel = require('../models/captain-model'); // ✅ Make sure this model exists
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListedTokenModel = require('../models/blacklist-token-model');

// ✅ Common function to extract token
const getToken = (req) => {
    return req.cookies.token || req.headers.authorization?.split(' ')[1];
};

// Middleware to authenticate regular user
module.exports.authUser = async (req, res, next) => {
    const token = getToken(req);
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListedTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized (blacklisted token).' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized (invalid token).' });
    }
};

// Middleware to authenticate captain
module.exports.AuthCaptain = async (req, res, next) => {
    const token = getToken(req);
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListedTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized (blacklisted token).' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.captain = captain;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized (invalid token).' });
    }
};
