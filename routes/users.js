const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const formatDate = require('../helpers/formatDate');

// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');

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

// GET Change avatar
router.get('/change-avatar', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('users/change-avatar', { user });
});

// POST Change avatar
router.post('/change-avatar', notLoggedIn, uploadCloud.single('avatar'), (req, res, next) => {
  const id = req.session.currentUser._id;
  const avatar = req.file.url;

  console.log(id)
  console.log(avatar)
  User.findByIdAndUpdate(id, {
    avatar: avatar
  })
    .then(data => {
      res.redirect('/users/' + id);
    })
    .catch(error => {
      console.log(error);
      res.render('/update', { user, error: 'Update failed' });
    })
});

// GET Delete avatar
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
  res.render('/update', { user, error: 'Unauthorized' });
});

// GET User profile
router.get('/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const birthday = formatDate(req.session.currentUser.birthday);
  const created = formatDate(req.session.currentUser.createdAt);

  const user = await User.findOne({ _id: id });
  const stories = await Story.find({ author: id }).populate('author');
  res.render('users/view', { user, stories, birthday, created });
});

module.exports = router;
