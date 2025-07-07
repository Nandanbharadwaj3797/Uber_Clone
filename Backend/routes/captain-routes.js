const express = require('express');
const captainController = require('../controllers/captain-controller');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const AuthMiddleware = require('../middlewares/auth-middleware'); // Import middleware module

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  [
    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage('First name is required and must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicles.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicles.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicles.capacity').isInt({ min: 1, max: 5 }).withMessage('Capacity must be between 1 and 5'),
    body('vehicles.vehiclesType').isIn(['car', 'bike', 'Auto']).withMessage('Vehicle type must be car, bike, or Auto')
  ],
  validateRequest,
  captainController.registerCaptain
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  captainController.loginCaptain
);

// Protect profile and logout routes with AuthCaptain middleware
router.get('/profile', AuthMiddleware.AuthCaptain, captainController.getCaptainProfile);

router.get('/logout', AuthMiddleware.AuthCaptain, captainController.logoutCaptain);

module.exports = router;
