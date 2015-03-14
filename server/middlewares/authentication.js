'use strict';

var jwt = require('jsonwebtoken'),
    compose = require('composable-middleware'),
    config = localrequire.config(),
    errors = localrequire.config('errors'),
    preloading = require('./preloading');

/* MOVE FROM HERE */

exports.sign = function(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    config.secrets.session,
    {
      expiresInMinutes: config.secrets.expiresInMinutes
    }
  );
};

exports.verify = function(token, callback) {
  jwt.verify(token, config.secrets.session, {}, function(err, login) {
    if (err) {
      if (err.message === 'jwt expired') {
        return callback(new errors.TokenExpiredError());
      } else {
        return callback(new errors.TokenInvalidError());
      }
    }
    console.log('authentication verify : ', login);
    
    callback(login);
  });
};

exports.requiresLogin = function(req, res, next) {
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      exports.verify(parts[1], function(err, login) {
        if (err) return next(err);
        req.login = login;
        next();
      });
    } else {
      return next(new errors.AuthenticationInvalidError());
    }
  } else {
    return next(new errors.AuthenticationRequiredError());
  }
};

exports.authenticate = compose()
  .use(exports.requiresLogin)
  .use(preloading.requiresMe);
