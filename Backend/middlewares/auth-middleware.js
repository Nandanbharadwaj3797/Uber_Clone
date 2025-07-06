const userModel = require('../models/user-model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user

module.exports.authUser = async (req, res, next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await userModel.findOne({token: token});

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized.' });
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
        res.status(401).json({ message: 'Unauthorized' });
    }
}