const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { UserSchema } = require('../schema');
const { validateUser, storeReturnTo } = require('../middleware');
const { registerPage, registerUser, loginPage, loginUser, logoutUser } = require('../controllers/users')




// Register routes

router.get('/register', registerPage)

router.post('/register', registerUser);


// Login routes

router.get('/login', loginPage)

router.post('/login', storeReturnTo, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), loginUser);

// Logout route

router.get('/logout', logoutUser);


module.exports = router;