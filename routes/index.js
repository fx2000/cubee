var express = require('express');
var router = express.Router();

// Cloudinary API
//const uploadCloud = require("../config/cloudinary.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cubee' });
});

module.exports = router;
