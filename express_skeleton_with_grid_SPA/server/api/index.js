(function() {
'use strict';

var express = require('express');
var router  = express.Router();
var api     = require('./api.js');
var multer  = require('multer');

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

/* api url=/api/lib/.... */
router.get   ('/lib',                 api.documents);            // GET all
router.post  ('/lib/post',            api.documentPost);         // POST (create)
router.get   ('/lib/:documentId',     api.documentById);         // GET :id
router.put   ('/lib/:documentId',     api.documentUpdate);       // PUT :id (update)
router.delete('/lib/:documentId',     api.documentDelete);       // DELETE :id

// router.post  ('/lib/post/multer',     api.documentPost1);        // POST (create)
router.post('/lib/post/multer', upload.array('file_input'), (req,res,next)  => {
    console.log('multer upload...');
    // const files = req.body.file_input;  BAD: stores files but throws error
    const files = req.files;
    const text  = req.body.text_input;
    console.log('req.files',files);
    console.log('req.body.text_input',text);
    if(!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.json({files: files,text:text});
});

router.get('/authors',    api.authors);
router.get('/types',      api.types);
router.get('/shelfs',     api.shelfs);

module.exports = router;

})()
