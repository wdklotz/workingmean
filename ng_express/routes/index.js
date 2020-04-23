var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
// router.get('/', function(req, res, next) {
    // const options = {
        // root: path.join(__dirname,'../public')
    // };
    // console.log(options);
    // res.sendFile('UI-Grid/index.html',options);
// });
router.get('/express', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});

module.exports = router;
