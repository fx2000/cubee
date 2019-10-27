'use strict';

const express = require('express');
const router = express.Router();

// BCrypt parameters
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// Load models
const User = require('../models/User');

// Load middlewares
const { isLoggedIn, notLoggedIn } = require('../middlewares/auth');

// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');

// GET User Signup
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

// POST User Signup
router.post('/signup', uploadCloud.single('avatar'), (req, res, next) => {
  const { username, password, name, lastName, email, birthday } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Try to find a user with those details
  User.findOne({$or: [{ 'email': email }, { 'username': username }] })
    .then(user => {
      // Check if the username or email address is already registered
      if (user !== null) {
        res.render('signup', { error: 'That username/email is already in use' });
        return;
      }
      // Check for empty form fields
      if (username === '' || password === '' || email === '' || name === '' || lastName === '' || birthday === '') {
        res.render('signup', { error: 'You must fill all required fields' })
        return;
      }
      // Create new user
      const newUser = {
        username,
        password: hashPass,
        email,
        name,
        lastName,
        birthday
      }
      if (req.file) { newUser.avatar = req.file.url }

      User.create(newUser)
        .then(() => {
          // Create session cookie and redirect
          req.session.currentUser = user;
          res.redirect('/')
        })
        .catch((error) => { console.log(error) })
    })
    .catch((error) => { console.log(error) })
});

// GET User Login
router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

// POST User Login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check for empty form fields
  if (email === '' || password === '') {
    res.render('login', { error: 'You must enter a username and password' });
    return;
  }

  // Try to find a user with those details
  User.findOne({ 'email': email })
    .then(user => {
      // If not found, send back error message
      if (!user) {
        res.render('login', { error: 'Email address not registered' });
        return;
      }

      // Check for correct password
      if (bcrypt.compareSync(password, user.password)) {
        // If correct, create session cookie and redirect
        req.session.currentUser = user;
        res.redirect('/stories');
      } else {
        // Otherwise, send back error message
        res.render('login', { error: 'Incorrect password' });
      }
    })
    .catch((error) => { console.log(error) });
});

// GET Log out
router.get('/logout', notLoggedIn, (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/');
  });
});

module.exports = router;