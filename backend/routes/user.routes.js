

const { registerUser, loginUser, getUserDetails } = require('../controllers/user.controllers');
const userRoutes = require('express').Router();

userRoutes.route('/register').post(registerUser);
userRoutes.route('/login').post(loginUser);
userRoutes.route('/userDetails').get(getUserDetails);

module.exports = userRoutes;