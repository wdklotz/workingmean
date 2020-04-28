var express = require('express');
var router  = express.Router();
var api = require('./api.js');

/* documents */
router.get( '/lib',               api.documents)       ///api/lib
// router.post('/lib',               api.documentCreate)
router.get('/lib/:documentId',    api.documentById)
// router.put('/lib/:documentId',    api.documentUpdate)
// router.delete('/lib/:documentId', api.documentDelete)

module.exports = router;
