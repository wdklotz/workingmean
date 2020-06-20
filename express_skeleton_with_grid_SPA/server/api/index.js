// (function() {
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
router.get   ('/lib',             api.documents);            // GET all
router.post  ('/lib/post',        api.documentPost);         // POST (create)
router.get   ('/lib/:documentId', api.documentById);         // GET :id
router.put   ('/lib/:documentId', api.documentUpdate);       // PUT :id (update)
router.delete('/lib/:documentId', api.documentDelete);       // DELETE :id

router.use   ('/lib/post/multer',
                upload.array('file_input'),
                api.documentPost1
                );

// router.use   ('/lib/post/multer', api.documentPost1);        // POST (create)

router.get('/authors',    api.authors);
router.get('/types',      api.types);
router.get('/shelfs',     api.shelfs);

module.exports = router;
// })()
