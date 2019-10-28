'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');

// Load models
const User = require('../models/User');
const Story = require('../models/Story');

// Load middleware
const { isLoggedIn, notLoggedIn } = require('../middlewares/auth');

// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');

// GET View stories
router.get('/', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const stories = await Story.find().populate('author');
  stories.forEach((story) => {
    story.relativeDate = moment(story.createdAt).fromNow();
  });
  stories.reverse();
  console.log(stories);
  res.render('stories/index', { user, stories });
});

// GET Create story
router.get('/create', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('stories/create', { user });
});

// POST Create story
router.post('/create', notLoggedIn, (req, res, next) => {
  const author = req.session.currentUser._id;
  const { title, content, reserved, restricted } = req.body;
  const newStory = {
    title,
    content,
    author,
    restricted,
    reserved
  }
  Story.create(newStory)
    .then(() => {
      res.redirect('/stories')
    })
    .catch((error) => { 
      console.log(error);
      res.render('stories/create', { error: 'Unable to create new story' });
    });
})

module.exports = router;