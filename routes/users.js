const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const formatDate = require('../helpers/formatDate');
const moment = require('moment');

// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');
// const { parser } = require('../config/cloudinary.js'); // TODO: Check if this is really necessary

// Load middlewares
const { notLoggedIn } = require('../middlewares/auth');

// GET User Update
router.get('/update', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const birthday = formatDate(req.session.currentUser.birthday);
  res.render('users/update', { user, birthday });
});

// POST User update
router.post('/update', notLoggedIn, async (req, res, next) => {
  let user = req.session.currentUser._id;
  const { username, name, lastName, email, birthday } = req.body;

  const checkUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
  // Check if the username or email address is already in use
  if (checkUser !== null) {
    res.render('users/update', { user, error: 'That username/email is already in use' });
  }

  await User.findByIdAndUpdate(user._id, {
    username: username,
    name: name,
    lastName: lastName,
    email: email,
    birthday: birthday
  });
  user = await User.findById(user._id);
  req.session.currentUser = user;
  res.redirect('/users/' + user._id);
});

// GET Change avatar
router.get('/change-avatar', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('users/change-avatar', { user });
});

// POST Change avatar
router.post('/change-avatar', notLoggedIn, uploadCloud.single('avatar'), async (req, res, next) => {
  const id = req.session.currentUser._id;
  const avatar = req.file.url;
  await User.findByIdAndUpdate(id, {
    avatar: avatar
  });
  const user = await User.findById(id);
  req.session.user = user;
  res.redirect('/users/' + id);
});

// GET Delete avatar
router.get('/delete-avatar/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;

  if (id === user._id) {
    await User.findByIdAndUpdate(id, {
      avatar: 'https://res.cloudinary.com/fx2000/image/upload/v1571924502/cubee/img/default-avatar_s8v2ls.png'
    });
    res.redirect('/users/' + id);
  }
  res.render('users/update', { user, error: 'Unauthorized' });
});

// GET User profile
router.get('/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const birthday = formatDate(req.session.currentUser.birthday);
  const created = formatDate(req.session.currentUser.createdAt);

  const user = await User.findOne({ _id: id });
  const stories = await Story.find({ author: id }).lean().populate('author dice');
  stories.forEach((story) => {
    story.relativeDate = moment(story.createdAt).fromNow();
    story.numComments = story.comments.length;
  });
  res.render('users/view', { user, stories, birthday, created });
});

module.exports = router;
