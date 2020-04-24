var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("home.jade");
});

// server side handling
router.get('/express', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});

module.exports = router;
