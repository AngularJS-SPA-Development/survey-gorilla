'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Group = require('./group.model');

exports.list = list;
exports.read = read;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.preload = preload;

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

  Group
    .findOne({ _id: id, deleted_at: { $exists: false } })
    .populate('owner members.member').exec(function(err, group) {
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
}

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
}

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
}

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
}

function preload(id) {
  var deferred = Q.defer();

  Group.findOne({ _id: id, deleted_at: { $exists: false } }).exec(function(err, group) {
    if (err) {
      if (err.name === 'CastError' && err.type === 'ObjectId')
        return deferred.reject(new errors.GroupNotFoundError(id));
      else return deferred.reject(err);
    }

    if (!group) return deferred.reject(new errors.GroupNotFoundError(id));

    deferred.resolve(group);
  });

  return deferred.promise;
}

exports.photo = {
  upload: function(group, image) {
    var deferred = Q.defer();

    group.has_photo = true;
    group.photo = image;

    group.save(function(err, group) {
      if (err) return deferred.reject(err);

      deferred.resolve(group);
    });

    return deferred.promise;
  },

  download: function(group) {
    var deferred = Q.defer();

    var id = group.id;

    Group.findOne({ _id: id }).exec(function(err, group) {
      if (err) {
        if (err.name === 'CastError' && err.type === 'ObjectId')
          return deferred.reject(new errors.GroupNotFoundError(id));
        else return deferred.reject(err);
      }

      if (!group) return deferred.reject(new errors.GroupNotFoundError(id));

      if (!group.has_photo || !group.photo)
        return deferred.reject(new errors.PhotoNotFoundError(id, 'Photo for group:' + id + ' is not found.'));

      deferred.resolve(group);
    });

    return deferred.promise;
  }
};

// members enroll/leave
exports.members = {
  enroll: function(group, user) {
    var deferred = Q.defer(),
        auto_approval = true,
        role = 'MEMBER';

    group.update({
      $addToSet: {
        members: {
          member: user.id,
          role: role
        }
      }
    }, function(err) {
      if (err) return deferred.reject(err);

      // alarm.memberRequested(group, user);
      // if (auto_approval) {
      //   alarm.memberApproved(group, user);
      // }

      deferred.resolve(group);
    });

    return deferred.promise;
  },
  leave: function(group, user) {
    var deferred = Q.defer();

    group.update({
      $pull: {
        members: {
          member: user.id
        }
      }
    }, function(err) {
      if (err) return deferred.reject(err);

      // alarm.memberLeaved(group, user);

      deferred.resolve(group);
    });

    return deferred.promise;
  }
};