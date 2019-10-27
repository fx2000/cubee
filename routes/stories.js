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

// GET create story

module.exports = router;