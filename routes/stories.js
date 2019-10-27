'use strict';

const express = require('express');
const router = express.Router();

// Load models
const Story = require('../models/Story');

// Load middleware
const { isLoggedIn, notLoggedIn } = require('../middlewares/auth');

// Cloudinary API
const uploadCloud = require('../config/cloudinary.js');

// GET View stories
router.get('/', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('stories/view', { user });
});

// GET Create story
router.get('/create', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('stories/create', { user });
});

// POST Create story
router.post('/create', notLoggedIn, (req, res, next) => {
  const author = req.session.currentUser._id;
  const { title, story, reserved, restricted } = req.body;
  console.log(req.body);
  const newStory = {
    title,
    story,
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