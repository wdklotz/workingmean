var express = require('express');
var multer  = require('multer');

var router  = express.Router();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'uploads')
    },
    filename: function(req,file,cb) {
        cb(null,file.originalname)
    }
})
/* WARN: must be placed behind 'var storage  = ...' expression */
var upload  = multer({ storage: storage });

/*
    Classic upload: trasfers file names only
*/
router.post('/post/classic', function(req, res, next) {
    console.log('posted classic...');
    let files = req.body.file_input;
    let text  = req.body.text_input;
    res.json({files: files,text:text});
});

/*
    upload with multer middleware: transfers and stores files on sever's side
*/
router.post('/post/multer', upload.array('file_input'), (req,res,next)  => {
    console.log('multer upload...');
    // const files = req.body.file_input;  BAD: stores files but throws error
    const files = req.files;
    const text  = req.body.text_input;
    // console.log('req.files',files);
    // console.log('req.body.text_input',text);
    if(!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.json({files: files,text:text});
});

module.exports = router;
