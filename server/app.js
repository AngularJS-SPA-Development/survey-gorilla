/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Setup components error & GLOBAL by peter yun
require('./components/errors/error');
require('./components/utilities/requires');

var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
require('./config/express')(app);
require('./routes')(app);

// var server = require('http').createServer(app);
// var socketio = require('socket.io').listen(server);
// require('./config/socketio')(socketio);
// 
// set io.js instead of socketio.js
var server = require('./config/io')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;