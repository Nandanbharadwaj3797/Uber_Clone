const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile,logoutUser } = require('../controllers/user-controller');
const { body } = require('express-validator');
const{authUser} = require('../middlewares/auth-middleware');


// Validation middleware
const validateRegister = [
  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

router.post('/register', validateRegister, registerUser);

router.post('/login',[
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
  loginUser

);

router.get('/profile',authUser,getUserProfile);

router.get('/logout', authUser, logoutUser);


module.exports = router;
