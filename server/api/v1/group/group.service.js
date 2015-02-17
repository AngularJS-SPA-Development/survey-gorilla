'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Group = require('./group.model');

exports.list = list;
exports.read = read;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

// Get list of group
function list(options) {
  var deferred = Q.defer();

  // Old Code 
  // Group.find({}, function (err, groups) {
  //   if(err) return deferred.reject(err);
  //   deferred.resolve(groups);
  // });
  // return deferred.promise;

  // 1) group name 검색 
  // 2) group member id 검색
  // 3) group created_at 정렬
  if (!options) options = {};
  if (!options.sort) options.sort = {};
  if (!options.sort.by) options.sort.by = 'created_at';
  if (!options.limit) options.limit = 10;
  if (options.limit < 1) options.limit = 1;
  if (options.limit > 100) options.limit = 100;

  var query = Group.find();
  query.where('deleted_at').exists(false);

  if (options.name) query.where('name').equals(new RegExp(options.name, 'i'));
  if (options.member && options.member.id) {
    var member = options.member;
    query.where('members.member');
    if (member.inverse) query.ne(member.id);
    else query.equals(member.id);
  }

  var sort = options.sort;
  query.where(sort.by);
  if (sort.lt) query.lt(sort.lt);
  if (sort.lte) query.lte(sort.lte);
  if (sort.gt) query.gt(sort.gt);
  if (sort.gte) query.gte(sort.gte);
  query.sort((sort.desc ? '-' : '') + sort.by);
  query.limit(options.limit);

  query.populate('owner');

  query.exec(function(err, groups) {
    if (err) return deferred.reject(err);
    deferred.resolve(groups);
  });

  return deferred.promise;
};

// Get a single group
function read(id) {
  var deferred = Q.defer();

  Group.findById(id, function (err, group) {
    if(err) return deferred.reject(err);
    if (!group) return deferred.reject(
      Error.new({
        code: 'GROUP_NOT_FOUND',
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
        code: 'GROUP_NOT_FOUND',
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
        code: 'GROUP_NOT_FOUND',
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