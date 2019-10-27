const express = require('express');
const router = express.Router();
const User = require('../models/User');
const formatDate = require('../helpers/formatDate');

const { parser } = require("../config/cloudinary.js");
const { isLoggedIn, notLoggedIn } = require("../middlewares/auth");

// GET User Update
router.get('/update', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const birthday = formatDate(req.session.currentUser.birthday);
  res.render('users/update', { user, birthday });
});

// POST User Update
router.post('/update', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const { id } = req.session.currentUser;
  const { username, name, lastName, email, birthday } = req.body;
  User.findByIdAndUpdate(id, {
    username: username,
    name: name,
    lastName: lastName,
    email: email,
    birthday: birthday
  })
    .then(data => {
      res.redirect('/users/' + id);
    })
    .catch(error => {
      console.log(error);
      res.render('users/update', { user, error });
    })
});

// GET User profile
router.get('/:id', notLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  const birthday = formatDate(req.session.currentUser.birthday);
  const created = formatDate(req.session.currentUser.createdAt)
  User.findOne({ _id: id })
    .then(user => {
      res.render('users/view', { user, currentUser, birthday, created });
    })
    .catch(error => {
      console.log(error);
      res.render('users/view', {error});
    })
});

// GET delete avatar
router.get('/delete-avatar/:id', notLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;

  if (id === user._id) {
    User.findByIdAndUpdate(id, {
      avatar: 'https://res.cloudinary.com/fx2000/image/upload/v1571924502/cubee/img/default-avatar_s8v2ls.png'
    })
      .then(data => {
        res.redirect('/users/' + id);
      })
      .catch(error => {
        console.log(error);
        res.render('/update', { user, error });
      })
  }
});

module.exports = router;
