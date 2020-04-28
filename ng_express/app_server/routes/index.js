var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/home', function(req, res, next) {
    res.render("home.jade");
});

// server side handling
router.get('/express', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});

// server side handling
router.get('/myHello', function(req, res, next) {
  res.render('myHello.jade', { title: 'Express' });
});

// SPA-client home page
router.get('/', (req, res, next) => {
  let file = path.join(__dirname, '..', '..','app_client', 'index.html');
  console.log("router.get => "+file);
  res.sendFile(file);
});

module.exports = router;
