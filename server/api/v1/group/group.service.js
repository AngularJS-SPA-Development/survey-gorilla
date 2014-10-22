'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Group = require('./group.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

// Get list of group
function index() {
  var deferred = Q.defer();

  Group.find({}, function (err, groups) {
    if(err) return deferred.reject(err);
     deferred.resolve(groups);
  });
  return deferred.promise;
};

// Get a single group
function show(id) {
  var deferred = Q.defer();

  Group.findById(id, function (err, group) {
    if(err) return deferred.reject(err);
    if (!group) return deferred.reject(
      Error.new({
        code: 'NOT_FOUND',
        message: 'Group: ' + id + ' is not found.'
      })
    );
    deferred.resolve(group);
  });
  return deferred.promise;
};

// Creates a new group in the DB.
function create(params, user) {
  var deferred = Q.defer();

  params.owner = user.id;
  params.members = [{
    member: user.id,
    role: 'OWNER'
  }];

  // new Group(params).save(
  // Group.create(params
  Group.create(params, function (err, group) {
    if(err) return deferred.reject(err);

    group.populate('owner members.member', function(err, group) {
      if (err) return deferred.reject(err);
      deferred.resolve(group);
    });
  });
  return deferred.promise;
};

// Updates an existing group in the DB.
function update(id, params) {
  var deferred = Q.defer();

  Group.findById(id, function (err, group) {
    if(err) return deferred.reject(err);
    if (!group) return deferred.reject(
      Error.new({
        code: 'NOT_FOUND',
        message: 'Group: ' + id + ' is not found.'
      })
    );

    var updated = _.merge(group, params);
    updated.save(function (err) {
      if (err) { return deferred.reject(err); }
      return deferred.resolve(group);
    }); 
  });
  return deferred.promise;
};

// Deletes a group from the DB.
function destroy(id) {
  var deferred = Q.defer();

  Group.findById(id, function (err, group) {
    if(err) return deferred.reject(err);
    if (!group) return deferred.reject(
      Error.new({
        code: 'NOT_FOUND',
        message: 'Group: ' + id + ' is not found.'
      })
    );

    group.remove(function(err) {
      if(err) { return deferred.reject(err); }
      return deferred.resolve(204);
    });
    
  });
  return deferred.promise;
};