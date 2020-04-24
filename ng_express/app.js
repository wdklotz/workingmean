var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var db           = require('./app_server/models/db.js');
const request = require('request');


var app = express();

// routing
var indexRouter = require('./routes/index.js');
var apiRouter   = require('./app_api/routes.js');

// server side request handling 
app.use('/',        indexRouter);
app.use('/api',     apiRouter);
// client side SPA files
app.use("/",        express.static(__dirname + "/public"));
app.use("/edms",    express.static(__dirname + "/app_client"));
app.use("/js",      express.static(__dirname + "/app_client/js"));
app.use("/css",     express.static(__dirname + "/app_client/css"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
