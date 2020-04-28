const db = require('../dbConnection/connector');
var {n_log, i_was_here} = require('../../app_helper.js');

const sendJsonResponse = function (res, status, content) {
    // i_was_here("api:sendJsonResponse");
    n_log("api:sendJsonResponse",content);
    res.status(status);
    res.json(content);
};

const documents = function(req,res) {      // http://127.0.0.1:3000/api/lib
    const sql = "SELECT * FROM doc";
    n_log("api:documents",req.baseUrl);
    n_log("api:documents",sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
        let content = [];
        const from = 100;
        const anz  = 100;
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
// request(requestOptions,function(err,response,body) {
    // if (err) {
        // console.log(err);
    // } else if (response.statusCode === 200) {
        // console.log(body);
    // } else {
        // console.log(response.statusCode);
    // }
// });

