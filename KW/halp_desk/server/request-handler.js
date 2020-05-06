const express    = require('express');
const router     = express.Router();
const pg         = require('pg');
const path       = require('path');
const connection = './server/halpdesk';
const sqlite3    = require('sqlite3').verbose();

const db = new sqlite3.Database(connection,sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to "+connection);
});

// db.all('SELECT * FROM tickets',[],(err,rows) => {
    // console.log("@LOAD => ./server/request-handler.js")
    // console.log(rows);
// });

exports.submitTicket = (req, res) => {
  const ticket = req.body;
  let sql = 'INSERT INTO tickets(author, subject, issue, chatUrl, archive, status) values ($1, $2, $3, $4, $5, $6)';
  let tickets = [ticket.author, ticket.subject, ticket.issue, ticket.chatUrl, ticket.archive, ticket.status];
  db.run(sql, tickets, function(err) {
      if(err) {
          return console.error(err.message);
      }
      console.log(`Rows inserted with Subject ${ticket.subject}`);
  });
  sql = 'SELECT * FROM tickets';
  db.all(sql,[],(err,rows)=> {
      if (err) {
          throw err;
      }
    return res.json(rows);
  });
};

exports.getOpenTickets = (req, res) => {
  let sql = 'SELECT * FROM tickets WHERE archive = false';
  db.all(sql,[],(err,openTickets)=> {
      if (err) {
          throw err;
      } else {
      return res.json(openTickets);
    }
  });
};

exports.getArchivedTickets = (req, res) => {
  let sql = 'SELECT * FROM tickets WHERE archive = true';
  db.all(sql,[],(err,archiveTickets)=> {
      if (err) {
          throw err;
      }
    return res.json(archiveTickets);
  });
};

exports.updateTicket = (req, res) => {
  const id = req.body.id;
  const ticket = Object.assign({}, req.body, { archive: !req.body.archive })
  let sql = 'UPDATE tickets SET archive = $1 WHERE id = $2';
  db.run(sql,[ticket.archive, id],(err,results)=> {
      if (err) {
          throw err;
      }
    return res.json(results);
  });
};

exports.deleteTicket = (req, res) => {
  let sql = 'DELETE FROM tickets WHERE tickets.id = $1';
  db.run(sql,req.body.id,(err,results)=> {
      if (err) {
          throw err;
      }
    return res.json(results);
  });
};
