var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var bodyParser    = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var edmsRouter  = require('./routes/edms');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',      indexRouter);
app.use('/users', usersRouter);
app.use('/edms',  edmsRouter);

/*// app.post('/post', (req,res) => {
    // console.log('posted...');
    // let files = req.body.file_input;
    // let text  = req.body.text_input;
    // res.send(JSON.stringify({files: files,text:text}));
// });*/

/*app.post('/multiupload', upload.array('newFiles',13), (req,res,next)  => {
    console.log('multiupload...');
    const files = req.files;
    console.log(files);
    console.log(req.body);
    if(!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(JSON.stringify(files)+"<h2>Upload done</h2>");
    // res.end();
});*/

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

/*  LINKS:
*   for multer see: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
*     and: http://expressjs.com/en/resources/middleware/multer.html
*     and: https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
*     also: https://blog.kevinchisholm.com/javascript/node-js/file-uploads-multer/
*/