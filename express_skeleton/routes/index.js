var express = require('express');
var router = express.Router();

/* GET home page. 
    NOTE: /public/index.html has higher priority
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
