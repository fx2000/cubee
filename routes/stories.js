'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');

// Load models
const Die = require('../models/Die');
const Story = require('../models/Story');
const UserDice = require('../models/UserDice');

// Load middleware
const {
  notLoggedIn
} = require('../middlewares/auth');

// GET Index stories
router.get('/', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const stories = await Story.find({
    reserved: false
  }).lean().populate('author dice');
  stories.forEach((story) => {
    story.relativeDate = moment(story.createdAt).fromNow();
    story.numComments = story.comments.length;
  });
  stories.reverse();
  console.log(stories.userDice)
  res.render('stories/index', {
    user,
    stories
  });
});
/*Setup create routes*/
router.get('/setup', notLoggedIn, async (req, res, next) => {
  res.render('stories/setup')
})

router.post('/setup', notLoggedIn, async (req, res, next) => {
  const {
    generic,
    dices
  } = req.body
  res.redirect('create/' + generic + '/' + dices)
})
// GET Create Story
router.get('/create/:generic/:dices', notLoggedIn, async (req, res, next) => {
  const {
    generic,
    dices
  } = req.params
  const user = req.session.currentUser;
  const dice = await Die.aggregate([{
    $sample: {
      size: generic * 1
    }
  }]);
  const userDice = await UserDice.aggregate([{
    $sample: {
      size: dices * 1
    }
  }]);

  const dicesArray = userDice.map(dice => new Object({
    _id: dice._id,
    icon: dice.icons[Math.floor(Math.random() * 5)]
  }))
  res.render('stories/create', {
    user,
    dice,
    dicesArray
  });
});

// POST Create story
router.post('/create', notLoggedIn, async (req, res, next) => {
  const author = req.session.currentUser._id;
  const {
    title,
    content,
    reserved,
    restricted,
    dicesArray
  } = req.body;
  console.log(dicesArray)

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
    ],
    userDice: dicesArray
  };

  await Story.create(newStory);
  res.redirect('/stories');
});

// POST Voting system
router.post('/vote/:id', notLoggedIn, async (req, res, next) => {
  const {
    id
  } = req.params;
  const {
    vote
  } = req.body;
  const user = req.session.currentUser;
  const score = (vote === 'up') ? 1 : -1;
  const story = await Story.findById(id);

  if (vote === 'up') {
    story.votes.push({
      user: user._id,
      vote: 1
    });
    story.save();
  } else if (vote === 'down') {
    story.votes.push({
      user: user._id,
      vote: -1
    });
    story.save();
  }
  await Story.findByIdAndUpdate(id, {
    $inc: {
      score: score
    }
  });
  res.redirect('/stories');
});

// POST Add comment
router.post('/comment/:id', notLoggedIn, async (req, res, next) => {
  const {
    id
  } = req.params;
  const user = req.session.currentUser;
  const {
    comment
  } = req.body;
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
  const {
    id
  } = req.params;
  const user = req.session.currentUser;
  const story = await Story.findById(id).lean().populate('author dice');
  story.relativeDate = moment(story.createdAt).fromNow();
  story.comments.forEach((comment) => {
    comment.relativeDate = moment(comment.date).fromNow();
  });
  story.comments.reverse();
  story.numComments = story.comments.length;
  res.render('stories/view', { user, story });
});

// POST Search
router.post('/search', notLoggedIn, async (req, res, next) => {
  const {
    terms
  } = req.body;
  const user = req.session.currentUser;

  try {
    const stories = await Story.find({
      $text: {
        $search: terms
      }
    }).populate('author dice');
    res.render('stories/index', {
      user,
      stories
    });
  } catch (error) {
    res.render('stories/index', {
      error: 'Something went wrong'
    });
  }
});

module.exports = router;