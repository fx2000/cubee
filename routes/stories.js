'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');

// Load models
// const User = require('../models/User');
const Story = require('../models/Story');

// Load middleware
const { notLoggedIn } = require('../middlewares/auth');

// Cloudinary API
// const uploadCloud = require('../config/cloudinary.js');

// GET View stories
router.get('/', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const stories = await Story.find().populate('author');
  stories.forEach((story) => {
    story.relativeDate = moment(story.createdAt).fromNow();
  });
  stories.reverse();
  res.render('stories/index', { user, stories });
});

// GET Create story
router.get('/create', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('stories/create', { user });
});

// POST Create story
router.post('/create', notLoggedIn, async (req, res, next) => {
  const author = req.session.currentUser._id;
  const { title, content, reserved, restricted } = req.body;
  const newStory = {
    title,
    content,
    author,
    restricted,
    reserved
  };
  await Story.create(newStory);
  res.redirect('/stories');
});

// POST Voting system
router.post('/vote/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { vote } = req.body;
  const user = req.session.currentUser;
  const score = (vote === 'up') ? 1 : -1;
  const story = await Story.findById(id);

  if (vote === 'up') {
    story.votes.push({ user: user._id, vote: 1 });
    story.save();
  } else if (vote === 'down') {
    story.votes.push({ user: user._id, vote: -1 });
    story.save();
  }
  await Story.findByIdAndUpdate(id, {
    $inc: { score: score }
  });
  res.redirect('/stories');
});

// POST Add comment
router.post('/comment/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;
  const { comment } = req.body;
  const story = await Story.findById(id);
  story.comments.push({
    userId: user._id,
    username: user.username,
    comment: comment,
    date: new Date()
  });
  res.redirect('/stories')
});

// GET Story details
router.get('/details/:id', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const story = await Story.findById(user._id);
  res.render('stories/create', { user, story });
})

// POST Search
router.post('/search', notLoggedIn, async (req, res, next) => {
  const { terms } = req.body;
  const user = req.session.currentUser;

  try {
    const stories = await Story.find({
      $text: { $search: terms }
    }).populate('author');
    res.render('stories/index', { user, stories });
  } catch (error) {
    res.render('stories/index', { error: 'Something went wrong' });
  }
});

module.exports = router;
