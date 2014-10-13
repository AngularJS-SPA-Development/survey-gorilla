'use strict';

var UserService = require('./user.service'),
    config = require('../../config/environment');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  UserService
    .index()
    .then(function(users) {
      res.json(200, users);
    })
    .catch(function(err) {
      res.send(500, err);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  UserService
    .create(req.body)
    .then(function(token) {
      res.json({ token: token });
    })
    .catch(function(err) {
      return validationError(res, err);
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  UserService
    .create(req.params.id)
    .then(function(profile) {
      res.json(profile);
    })
    .catch(function(err) {
      if(err && err.code && err.code === 'USER_NOT_FOUND') {
        return res.send(401);
      } 
      if (err) return next(err);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  UserService
    .destroy(req.params.id)
    .then(function() {
      res.send(204);
    })
    .catch(function(err) {
      if (err) return res.send(500, err);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  UserService
    .changePassword(userId, oldPass, newPass)
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      if(err && err.code && err.code === 'FORBIDDEN') {
        return res.send(403);
      } 
      return validationError(res, err);
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  UserService
    .me(req.user._id)
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      if(err && err.code && err.code === 'USER_NOT_FOUND') {
        return res.send(401);
      } 
      if (err) return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
