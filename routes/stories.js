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

// GET Upvote story
router.get('/upvote/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;

  const story = await Story.findOne({ _id: id });
  story.votes.push({ user: user._id, vote: 1 });
  story.save();
  res.redirect('/stories');
});

// GET Downvote story
router.get('/downvote/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;

  const story = await Story.findOne({ _id: id });
  story.votes.push({ user: user._id, vote: -1 });
  story.save();
  res.redirect('/stories');
});

module.exports = router;
