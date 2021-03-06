'use strict';
var express      = require('express');
var cors         = require('cors');     // cross-origin resource sharing
var createError  = require('http-errors');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var logger       = require('morgan');
var indexRouter  = require('./routes/index');
var apiRouter    = require('./server/api/index');

var app    = express();
// set
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// use middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // be careful! needed for HTTP-POST
app.use(bodyParser.json());                         // be careful! needed for HTTP-PUT
app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use('/api', apiRouter);     // RESTFUL API routes
app.use('/',    indexRouter);
/* same as above ...
app.get('/', function(req,res) {
    res.sendFile('index.html',{root: path.join(__dirname,'views')});
})
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Error-handling middleware
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// app.listen(3000); not needed for nodemon but works with `node app.js`
