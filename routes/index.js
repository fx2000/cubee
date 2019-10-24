const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'cubee', layout: 'layout'});
});

module.exports = router;
