const express = require('express');
const captainController = require('../controllers/captain-controller');
const router = express.Router();

const { body } = require('express-validator');

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name is required and must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicles.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicles.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicles.capacity').isInt({ min: 1, max: 5 }).withMessage('Capacity must be between 1 and 5'),
    body('vehicles.vehiclesType').isIn(['car', 'bike', 'Auto']).withMessage('Vehicle type must be car, bike, or Auto')
], captainController.registerCaptain);

module.exports = router;
