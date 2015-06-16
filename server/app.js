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
    config = require('./config/environment'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    cors = require('cors');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io').listen(server);
require('./config/socketio')(socketio);
require('./config/express')(app);

// add multer
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({
  dest: './.tmp/',
  limits: {
    files: 1,
    fileSize: 10 * 1024 * 1024,
    fields: 1,
    fieldSize: 1024
  }
}));
app.use(methodOverride());
// add cors
app.route('/api/*')
  .all(cors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Auth-Token'],
    credentials: true,
    maxAge: 86400
  }));

require('./routes')(app);


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;