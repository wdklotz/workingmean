var express = require('express');
var router  = express.Router();
var api = require('./api.js');

/* documents api url=/api/lib */
router.get( '/lib',               api.documents);       // GET 
// router.post('/lib',               api.documentCreate);  // POST
router.get('/lib/:documentId',    api.documentById);    // GET:id
// router.put('/lib/:documentId',    api.documentUpdate);  // PUT
// router.delete('/lib/:documentId', api.documentDelete);  // DELETE:id

module.exports = router;
 