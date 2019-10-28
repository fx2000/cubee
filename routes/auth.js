'use strict';

const express = require('express');
const router = express.Router();

// BCrypt parameters
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// Load models
const User = require('../models/User');

// Load middlewares
const { notLoggedIn } = require('../middlewares/auth');
const uploadCloud = require('../config/cloudinary.js');

// GET User Signup
router.get('/signup', function (req, res, next) {
  res.render('signup')
});

// POST User Signup
router.post('/signup', uploadCloud.single('avatar'), async (req, res, next) => {
  const { username, password, confirmPassword, name, lastName, email, birthday } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Check if password confirmation matches
  if (password !== confirmPassword) {
    res.render('signup', { error: 'Password confirmation failed' });
  }

  try {
    const user = await User.findOne({ $or: [{ email: email }, { username: username }] });

    // Check if the username or email address is already registered
    if (user !== null) {
      res.render('signup', { error: 'That username/email is already in use' });
    }
    // Check for empty form fields
    if (username === '' || password === '' || email === '' || name === '' || lastName === '' || birthday === '') {
      res.render('signup', { error: 'You must fill all required fields' });
    }
    // Assemble new user
    const newUserDetails = {
      username,
      password: hashPass,
      email,
      name,
      lastName,
      birthday
    };
    // Check if user included a custom avatar
    if (req.file) {
      newUserDetails.avatar = req.file.url;
    }
    const newUser = await User.create(newUserDetails);
    req.session.currentUser = newUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// GET User Login
router.get('/login', function (req, res, next) {
  res.render('login');
});

// POST User Login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Try to find a user with those details
    const user = await User.findOne({ email: email });

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
  } catch (error) {
    next(error);
  }
});

// GET Change password
router.get('/change-password', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('change-password', { user });
});

/*
// POST Change password TODO: Switch to async/await
router.post('/change-password', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const { password, newPassword } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(newPassword, salt);

  // Check for correct password
  if (bcrypt.compareSync(password, user.password)) {
    User.findByIdAndUpdate(user._id, {
      password: hashPass
    })
      .then(data => {
        res.redirect('/users/' + user._id);
      })
      .catch(error => {
        console.log(error);
        res.render('/change-password', {
          error: 'Update failed'
        });
      })
  } else {
    // Otherwise, send back error message
    res.render('/change-password', {
      error: 'Update failed'
    });
  }
});
*/

// POST Change password TODO: Fix this properly
router.post('/change-password', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { password, newPassword, confirmPassword } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(newPassword, salt);

  if (newPassword !== confirmPassword) {
    res.render('change-password', { error: 'Password confirmation failed' });
  }

  if (bcrypt.compareSync(password, user.password)) {
    try {
      await User.findByIdAndUpdate(user._id, {
        password: hashPass
      });
      res.redirect('/users/' + user._id);
    } catch (error) {
      res.render('change-password', {
        error: 'Password update failed'
      });
    }
  }
  res.render('change-password', { error: 'You must enter the correct current password to proceed' });
});

// GET Log out
router.get('/logout', notLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
