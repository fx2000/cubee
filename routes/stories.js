const express = require('express');
const router = express.Router();

// Cloudinary API
const uploadCloud = require("../config/cloudinary.js");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('STORIES');
});

module.exports = router;