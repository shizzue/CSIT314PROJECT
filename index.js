//------------------------------------
// index.js
//------------------------------------

//------------------------------------
// Imports
//------------------------------------
const express = require('express');
const path = require('path');
const app = express();
const database = require('./config/database');
var cors = require('cors');
app.options('*', cors());
app.use(cors());


var router = require('./config/router');
//------------------------------------
// Middleware
//------------------------------------
// To connect to database
// database.connect();

database.connect()
  .then(() => {
    database.query('SELECT NOW() AS "theTime"')
      .then(result => {
        console.log('Connected to the database. Current time in the database:', result.rows[0].theTime);
      })
      .catch(error => {
        console.error('Error executing test query:', error);
      });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

// The web server

// To handle body
app.use(express.json());

// For postman testing (To accept x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false })); 

// Web Server
app.use(express.static(path.join(__dirname, 'src/boundary/html')));

// Middleware to see req url and req method
// This must be put below express
app.use(function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    next();
  });

app.use('/app', router);

// Listen to port (8000 if local)
//app.listen(process.env.PORT, function () {
app.listen(3000, function () {
    console.log('App listening on port 3000');
});