'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');

// Load models
const Die = require('../models/Die');
const Story = require('../models/Story');

// Load middleware
const { notLoggedIn } = require('../middlewares/auth');

// Cloudinary API
// const uploadCloud = require('../config/cloudinary.js');

// GET Index stories
router.get('/', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const stories = await Story.find().lean().populate('author dice');
  stories.forEach((story) => {
    story.relativeDate = moment(story.createdAt).fromNow();
    story.numComments = story.comments.length;
  });
  stories.reverse();
  res.render('stories/index', { user, stories });
});

// GET Create Story
router.get('/create', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const dice = await Die.aggregate([
    { $sample: { size: 9 } }
  ]);
  console.log(dice);
  res.render('stories/create', { user, dice });
});

// POST Create story
router.post('/create', notLoggedIn, async (req, res, next) => {
  const author = req.session.currentUser._id;
  console.log(req.body);
  const { title, content, reserved, restricted } = req.body;
  const newStory = {
    title,
    content,
    author,
    restricted,
    reserved,
    dice: [
      req.body.dice0,
      req.body.dice1,
      req.body.dice2,
      req.body.dice3,
      req.body.dice4,
      req.body.dice5,
      req.body.dice6,
      req.body.dice7,
      req.body.dice8
    ]
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
    avatar: user.avatar,
    comment: comment,
    date: new Date()
  });
  story.save();
  res.redirect('/stories');
});

// GET View story details
router.get('/view/:id', notLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const user = req.session.currentUser;
  const story = await Story.findById(id).lean().populate('author dice');
  story.relativeDate = moment(story.createdAt).fromNow();
  story.comments.forEach((comment) => {
    comment.relativeDate = moment(comment.date).fromNow();
  });
  story.comments.reverse();
  story.numComments = story.comments.length;
  console.log(user, story);
  res.render('stories/view', { user, story });
});

// POST Search
router.post('/search', notLoggedIn, async (req, res, next) => {
  const { terms } = req.body;
  const user = req.session.currentUser;

  try {
    const stories = await Story.find({
      $text: { $search: terms }
    }).populate('author dice');
    res.render('stories/index', { user, stories });
  } catch (error) {
    res.render('stories/index', { error: 'Something went wrong' });
  }
});

module.exports = router;
