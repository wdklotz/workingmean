'use strict';
(function(){
    
const db = require('../dbConnection/connector');
let {app_log, tbl_log, i_was_here} = require('../../svr_helper');

const sendJsonResponse = function (res, status, content) {
    i_was_here("sendJsonResponse");
    // app_log(content);
    res.json(content);
    res.status(status);
    res.end();
};

const documents = function(req,res) {      // all -> /api/lib
    i_was_here('documents');
    const sql =`SELECT d.*, a.Author, t.Type, s.Shelf FROM doc As d
                INNER JOIN doc_author AS a ON a.id = d.author 
                INNER JOIN doc_type   AS t ON t.id = d.type 
                INNER JOIN doc_shelf  AS s ON s.id = d.shelf`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        };
        if(true) {   // (from...to) limits on table-rows
            let content = [];
            const from = 0;
            const anz  = 5;
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
    i_was_here('documentById');
    const docId  = req.params.documentId;
    const sql = `SELECT d.*, a.Author, t.Type, s.Shelf FROM doc As d
                 INNER JOIN doc_author AS a ON a.id = d.author 
                 INNER JOIN doc_type   AS t ON t.id = d.type 
                 INNER JOIN doc_shelf  AS s ON s.id = d.shelf
                 WHERE d.id = ${docId}`;
    
    db.get(sql, [], (err,row) => {
        if (err) {
           return console.error(err.message); 
        }
        sendJsonResponse(res,200,row);
    });
};

const documentUpdate = function(req,res) {
    i_was_here('documentUpdate');
    const docId    = req.params.documentId;
    const body = req.body;
    app_log('body: '+JSON.stringify(body));
    
    const sql1 = `SELECT a.id FROM doc_author AS a
                    WHERE a.author='${body.Author}'`;
    app_log('sql1: '+sql1);
    db.get(sql1,[],(err,row)=>{
        app_log('authId: '+JSON.stringify(row));
        body.author = row.id;
    });
    
    const sql2 = `SELECT a.id FROM doc_type AS a
                    WHERE a.type='${body.Type}'`;
    app_log('sql2: '+sql2);
    db.get(sql2,[],(err,row)=>{
        app_log('typeId: '+JSON.stringify(row));
        body.type = row.id;
    });
    
    const sql3 = `SELECT a.id FROM doc_shelf AS a
                    WHERE a.shelf='${body.Shelf}'`;
    app_log('sql3: '+sql3);
    db.get(sql3,[],(err,row)=>{
        app_log('shelfId: '+JSON.stringify(row));
        body.shelf = row.id;
    });
    
    const sql4 = `UPDATE doc SET
                 author   = '${body.author}',
                 type     = '${body.type}',
                 shelf    = '${body.shelf}',
                 keywords = '${body.Keywords}',
                 favorite = '${body.Favorite}',
                 trash    = '${body.Trash}'
                 WHERE id = ${docId}`;
    app_log('sql4: '+sql4);
    db.run(sql4, [], (err) => {
        if (err) {
           return console.error(err.message); 
        }
        app_log(`Row(s) updated: ${docId}`+JSON.stringify(body));
    });
};

module.exports.documents      = documents;
module.exports.documentCreate = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};
module.exports.documentById   = documentById;
module.exports.documentUpdate = documentUpdate;
module.exports.documentDelete = function(req,res) {sendJsonResponse(res,200,{"status":"success"})};

const authors = function(req,res) {
    i_was_here('authors');
    const sql = `SELECT * from doc_author`;
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        } else {     // all table-rows
            tbl_log(rows);
            sendJsonResponse(res,200,rows);
        } 
    });
};

const types = function(req,res) {
    i_was_here('types');
    const sql = `SELECT * from doc_type`;
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        } else {     // all table-rows
            tbl_log(rows);
            sendJsonResponse(res,200,rows);
        } 
    });
};

const shelfs = function(req,res) {
    i_was_here('shelfs');
    const sql = `SELECT * from doc_shelf`;
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        } else {     // all table-rows
            tbl_log(rows);
            sendJsonResponse(res,200,rows);
        } 
    });
};

module.exports.authors  = authors;
module.exports.types    = types;
module.exports.shelfs   = shelfs;

})();
