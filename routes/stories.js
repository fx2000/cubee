const express = require('express');
const router = express.Router();
const { isLoggedIn, notLoggedIn } = require('../middlewares/auth');

// GET View stories
router.get('/', notLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('stories/view', { user });
});

module.exports = router;