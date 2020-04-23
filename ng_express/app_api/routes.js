var express = require('express');
var router  = express.Router();
var ctrlLib = require('./controllers/library.js');

console.log(ctrlLib);

/* documents */
router.get( '/lib',               ctrlLib.documents)
// router.post('/lib',               ctrlLib.documentCreate)
router.get('/lib/:documentId',    ctrlLib.documentById)
// router.put('/lib/:documentId',    ctrlLib.documentUpdate)
// router.delete('/lib/:documentId', ctrlLib.documentDelete)

module.exports = router;
