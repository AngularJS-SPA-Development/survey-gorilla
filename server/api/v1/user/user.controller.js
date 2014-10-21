'use strict';

var UserService = require('./user.service');

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
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
function create(req, res, next) {
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
function show(req, res, next) {
  UserService
    .show(req.params.id)
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
function destroy(req, res) {
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
function changePassword(req, res, next) {
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
function me(req, res, next) {
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
function authCallback(req, res, next) {
  res.redirect('/');
};
