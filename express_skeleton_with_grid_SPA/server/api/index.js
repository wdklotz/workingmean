'use strict';
(function() {
    
var express = require('express');
var router  = express.Router();
var api = require('./api.js');

/* api url=/api/lib/.... */

router.get( '/lib',               api.documents);          // GET all
router.post('/lib',               api.documentCreate);     // POST (create)
router.get('/lib/:documentId',    api.documentById);       // GET :id
router.put('/lib/:documentId',    api.documentUpdate);     // PUT :id (update)
router.delete('/lib/:documentId', api.documentDelete);     // DELETE :id

router.get('/authors',    api.authors);
router.get('/types',      api.types);
router.get(' /shelfs',    api.shelfs);

module.exports = router;

})();
 