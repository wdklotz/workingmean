var express      = require('express');
var cors         = require('cors');
var createError  = require('http-errors');
var path         = require('path');
// var multer       = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var logger       = require('morgan');
var indexRouter  = require('./routes/index');
var apiRouter    = require('./server/api/index');

// var upload = multer();
var app    = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
// for parsing multipart/form-data
// app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());
// app.use(bodyParser.text());
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/api', apiRouter);     // RESTFUL API routes
app.use('/', indexRouter);
/* same as above ...
app.get('/', function(req,res) {
    res.sendFile('index.html',{root: path.join(__dirname,'views')});
})
*/

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

app.listen(3000);
