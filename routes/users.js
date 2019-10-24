const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// Cloudinary API
const uploadCloud = require("../config/cloudinary.js");

// GET User Signup
router.get('/signup', function (req, res, next) {
  res.render('users/signup', { title: 'Sign Up' });
});

// POST User Signup
router.post('/signup', uploadCloud.single("avatar"), (req, res, next) => {
  const {username, password, name, lastName, email, birthDate} = req.body;
  const avatar = req.file.url;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  
  // Try to find a user with those details
  User.findOne({$or: [{'email': email}, {'username': username}]})
    .then(user => {
      // Check if the username or email address is already registered
      if (user !== null) {
        res.render('users/signup', {error: "That username/email is already in use"});
        return;
      }
      // Check for empty form fields
      if (username === '' || password === '' || email === '' || name === '' || lastName === '' || birthDate === '') {
        res.render('users/signup', {error: "You must fill all required fields"})
        return;
      }
      // Create new user
      User.create({
        username,
        password: hashPass,
        email,
        name,
        lastName,
        birthDate,
        avatar
      })
      .then(() => {
        // Create session cookie and redirect
        req.session.currentUser = user;
        res.redirect('/users')
      })
      .catch((error) => {console.log(error)})
    })
    .catch((error) => {console.log(error)})
});

// GET User Login
router.get('/login', (req, res, next) => {
  res.render('users/login', { title: 'Log in' });
});

// POST User Login
router.post('/login', (req, res, next) => {
  const {email, password} = req.body;

  // Check for empty form fields
  if (email === '' || password === '') {
    res.render('users/login', {error: "You must enter a username and password"});
    return;
  }

  // Try to find a user with those details
  User.findOne({'email': email})
    .then(user => {

      // If not found, send back error message
      if (!user) {
        res.render('users/login', {error: "Email address not registered"});
        return;
      }

      // Check for correct password
      if (bcrypt.compareSync(password, user.password)) {
        // If correct, create session cookie and redirect
        req.session.currentUser = user;
        res.redirect('/users');
      } else {
        // Otherwise, send back error message
        res.render('users/login', {error: "Incorrect password"});
      }
    })
    .catch((error) => {console.log(error)});
});

// PRIVATE routes start here, check for active session first

router.use((req, res, next) => {
  if (req.session.currentUser) { // Check for an active session
    next(); // Skip ahead to next route if logged in
  } else {
    res.redirect("/users/login"); // Send back to login screen otherwise
  }
});

// GET User profile
router.get('/', function(req, res, next) {
  res.render('users/view', { title: 'User Profile' });
});

// GET User Update
router.get('/update', function (req, res, next) {
  res.render('users/update', { title: 'Update Profile' });
});

// GET Log out
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
