'use strict';

const sqlite3   = require('sqlite3').verbose();
const locations = require('../../locations');

const dbURI = locations.db;
const db    = new sqlite3.Database(dbURI,sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to "+dbURI);
});

// ================shutdown=====================
const gracefulShutdown = function(msg,callback) {
    console.log('Sqlite3 disconnected through ' + msg);
    callback();
};
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function(){
        db.close();
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function(){
        db.close();
        process.exit(0) ;
    });
});

module.exports = db;
