const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// Cloudinary API
const uploadCloud = require("../config/cloudinary.js");

// GET User profile
router.get('/', function(req, res, next) {
  res.render('users/view', { title: 'User Profile' });
});

// GET User Signup
router.get('/signup', function (req, res, next) {
  res.render('users/signup', { layout:'layout' });
});

// POST User Signup
router.post('/signup', uploadCloud.single("avatar"), (req, res, next) => {
  const {username, password, name, lastName, email, birthDate} = req.body;
  const avatar = req.file.url;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  
  User.findOne({$or: [{'email': email}, {'username': username}]})
    .then(user => {
      if (user !== null) {
        res.render('users/signup', {error: "That username/email is already in use"});
        return;
      }
      if (username === "" || password === "" || email === "" || name === "" || lastName === "" || birthDate === "") {
        res.render('users/signup', {error: "You must fill all required fields"})
        return;
      }
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
        req.session.currentUser = user;
        res.redirect('/users')
      })
      .catch((error) => {console.log(error)})
    })
    .catch((error) => {console.log(error)})
});

// GET User Login
router.get('/login', function (req, res, next) {
  res.render('users/login', { layout:'layout' });
});

// GET User Update
router.get('/update', function (req, res, next) {
  res.render('users/update', { title: 'Update Profile' });
});

module.exports = router;
