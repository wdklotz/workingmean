const db = require('../../app_server/models/db.js');

const sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

const documents = function(req,res) {      // http://127.0.0.1:3000/api/lib
    const sql = "SELECT * FROM doc";
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
        let content = [];
        const from = 100;
        const anz = 3;
        for (let i=0; i<=(anz-1); i++) {
            content[i]=rows[i+from];
        }
        sendJsonResponse(res,200,content);
    })  
};

module.exports.documents = documents;
module.exports.documentCreate = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};
module.exports.documentById   = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};
module.exports.documentUpdate = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};
module.exports.documentDelete = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};

