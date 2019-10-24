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
  const {username, password, name, lastName, email, birthday} = req.body;
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
      if (username === '' || password === '' || email === '' || name === '' || lastName === '' || birthday === '') {
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
        birthday,
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
  const user = req.session.currentUser;
  res.render('users/view', {user});
});

// GET User Update
router.get('/update', function (req, res, next) {
  const user = req.session.currentUser;
  res.render('users/update', {user});
});

// POST User Update
router.post('/update', (req, res, next) => {
  const id = req.session.currentUser._id;
  const {username, name, lastName, email, birthday} = req.body;
  if (req.file.url != null) {
    const avatar = req.file.url;
  } else{
    const avatar = null;
  } //TODO: FIX THIS!
  

  User.findOneAndUpdate(
    {_id: id},
    {$set: {username, name, lastName, email, birthday, avatar}},
    {new: true})
    .then(data => {
      res.redirect('/users');
    })
    .catch(error => {
      console.log(error);
      res.render('users/update', {user, error});
    })
});

// GET Log out
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
