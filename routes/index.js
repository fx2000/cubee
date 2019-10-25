const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', {layout: false});
});

router.get('/welcome', function(req, res, next) {
  res.render('index', {layout: 'layout'});
});
module.exports = router;
//coment