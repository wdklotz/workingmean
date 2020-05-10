const db = require('../dbConnection/connector');
var {n_log, i_was_here} = require('../../app_helper.js');

const sendJsonResponse = function (res, status, content) {
    // i_was_here("api:sendJsonResponse");
    n_log("api:sendJsonResponse",content);
    res.json(content);
    res.status(status);
    res.end();
};

const documents = function(req,res) {      // all -> /api/lib
    const sql =`SELECT d.*, a.Author, t.Type, s.Shelf FROM doc As d
                INNER JOIN doc_author AS a ON a.id = d.author 
                INNER JOIN doc_type   AS t ON t.id = d.type 
                INNER JOIN doc_shelf  AS s ON s.id = d.shelf`;
    
    // n_log("api:documents",'baseURL: '+req.baseUrl+'  SQL: '+sql);
    // n_log("api:documents",sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        };
        if(false) {   // (from...to) limits on table-rows
            let content = [];
            const from = 0;
            const anz  = 1;
            for (let i=0; i<=(anz-1); i++) {
                content[i]=rows[i+from];
                }
             sendJsonResponse(res,200,content);
       } else {     // all table-rows
            sendJsonResponse(res,200,rows);
        }
    })  
};

const documentById = function(req,res) {      // id:38 -> /api/lib/38
    const docId  = req.params.documentId;
    const sql = `SELECT d.*, a.Author, t.Type, s.Shelf FROM doc As d
                 INNER JOIN doc_author AS a ON a.id = d.author 
                 INNER JOIN doc_type   AS t ON t.id = d.type 
                 INNER JOIN doc_shelf  AS s ON s.id = d.shelf
                 WHERE d.id = ${docId}`;
    
    // n_log("api:documentById",sql);
    db.get(sql, [], (err,row) => {
        if (err) {
           return console.error(err.message); 
        }
        sendJsonResponse(res,200,row);
    });
};

const documentUpdate = function(req,res) {
    const docId    = req.params.documentId;
    const document = req.body;
    
    const sql = `UPDATE doc SET
                 keywords = "${document.Keywords}",
                 favorite = "${document.Favorite}",
                 trash = "${document.Trash}"
                 WHERE id = ${docId}`;
    // console.log(sql);
    db.run(sql, [], (err) => {
        if (err) {
           return console.error(err.message); 
        }
        console.log(`Row(s) updated: ${docId}`,document);
    });
};

module.exports.documents      = documents;
module.exports.documentCreate = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};
module.exports.documentById   = documentById;
module.exports.documentUpdate = documentUpdate;
module.exports.documentDelete = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};

/*
const apiOptions = {
    server: "http://localhost:3000"
};
const requestOptions = {
    url: apiOptions.server+"/api/lib",
    method: "GET",
    json: {},
    qs: {
        offset: "optional"
    }
};
request(requestOptions,function(err,response,body) {
    if (err) {
        console.log(err);
    } else if (response.statusCode === 200) {
        console.log(body);
    } else {
        console.log(response.statusCode);
    }
});
*/
