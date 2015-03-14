/**
 * Express configuration
 */

'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./environment'),
    passport = require('passport'),
    multer = require('multer'),
    cors = require('cors'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(multer({
    dest: './.tmp/',
    limits: {
      files: 1,
      fileSize: 2 * 1024 * 1024,
      fields: 1,
      fieldSize: 1024
    }
  }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  }));
  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
  }

  // add cors
  app.route('/api/*')
    .all(cors({
      origin: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Auth-Token'],
      credentials: true,
      maxAge: 86400
    }));

  app.use(errorHandler()); // Error handler - has to be last
};