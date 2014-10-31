'use strict';

var Q = require('q'),
    User = require('./user.model'),
    Group = require('../group/group.model'),
    passport = require('passport'),
    config = localrequire.config(), //('../../../config/environment'),
    jwt = require('jsonwebtoken');


/**
 * exports 내역 
 * @type {[type]}
 */
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;

/**
 * Get list of users
 * restriction: 'admin'
 */
function index() {
  var deferred = Q.defer();

  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return deferred.reject(err);
     deferred.resolve(users);
  });
  return deferred.promise;
};

/**
 * Creates a new user
 */
function create(params) {
  var deferred = Q.defer();

  var newUser = new User(params);
  newUser.provider = 'local';
  if(params.role) {
    newUser.role = params.role;
  } else {
    newUser.role = 'user';
  }
  newUser.save(function(err, user) {
    if (err) return deferred.reject(err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*24*365 });
    user.authToken = token;
    deferred.resolve(user);
  });
  return deferred.promise;
};

/**
 * Get a single user
 */
function show(userId) {
  var deferred = Q.defer();

  User.findById(userId, function (err, user) {
    if (err) return deferred.reject(err);
    if (!user) return deferred.reject(
      Error.new({
        code: 'USER_NOT_FOUND',
        message: 'User: ' + userId + ' is not found.'
      })
    );

    // Reads the groups of this user
    Group.find({
      'members.member': userId,
      deleted_at: { $exists: false }
    })
    .populate('owner')
    .exec(function(err, groups) {
      if (err) return deferred.reject(err);

      // Adds 'groups' property for json rendering
      user.groups = groups;

      deferred.resolve(user);
    });
    // not used : deferred.resolve(user.profile);
  });
  return deferred.promise;
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(userId) {
  var deferred = Q.defer();

  User.findByIdAndRemove(userId, function(err, user) {
    if(err) return deferred.reject(err);
    return deferred.resolve(204);
  });
  return deferred.promise;
};

/**
 * Change a users password
 */
function changePassword(userId, oldPass, newPass) {
  var deferred = Q.defer();

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return deferred.reject(err);
        deferred.resolve(200);
      });
    } else {
      deferred.reject(
        Error.new({
          code: 'FORBIDDEN',
          message: 'User: ' + userId + ' is forbidden.'
        })
      );
    }
  });
  return deferred.promise;
};

/**
 * Get my info
 */
function me(userId) {
  var deferred = Q.defer();

  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return deferred.reject(err);
    if (!user) return deferred.reject(
      Error.new({
        code: 'USER_NOT_FOUND',
        message: 'User: ' + userId + ' is not found.'
      })
    );
    deferred.resolve(user);
  });
  return deferred.promise;
};
