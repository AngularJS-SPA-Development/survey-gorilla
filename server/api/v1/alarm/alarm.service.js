'use strict';

var Q = require('q'),
    _ = require('lodash'),
    errors = localrequire.errors(),
    mongoose = require('mongoose'),
    Alarm = localrequire.Alarm(),
    common = localrequire.common(),
    io = localrequire.IO();

exports.list = list;
exports.preload = preload;
exports.read = read;

// socket.io
exports.groupUpdated = groupUpdated;
exports.groupRemoved = groupRemoved;
exports.cardPublished = cardPublished;
exports.cardResponded = cardResponded;
exports.cardCompleted = cardCompleted;

exports.memberRequested = memberRequested;
exports.memberApproved = memberApproved;
exports.memberDenied = memberDenied;
exports.memberLeaved = memberLeaved;
exports.memberBanned = memberBanned;
exports.memberInvited = memberInvited;

function list(options) {
  if (!options) options = {};
  if (!options.sort) options.sort = {};
  if (!options.sort.by) options.sort.by = 'created_at';
  if (!options.limit) options.limit = 10;
  if (options.limit < 1) options.limit = 1;
  if (options.limit > 100) options.limit = 100;

  var query = Alarm.find();

  if (options.for) query.where('for').equals(options.for);
  if (options.read !== undefined) query.where('read').equals(options.read);

  var sort = options.sort;
  query.where(sort.by);
  if (sort.lt) query.lt(sort.lt);
  if (sort.lte) query.lte(sort.lte);
  if (sort.gt) query.gt(sort.gt);
  if (sort.gte) query.gte(sort.gte);
  query.sort((sort.desc ? '-' : '') + sort.by);
  query.limit(options.limit);

  var deferred = Q.defer();

  query.exec(function(err, alarms) {
    if (err) return deferred.reject(err);

    deferred.resolve(alarms);
  });

  return deferred.promise;
}

function preload(id) {
  var deferred = Q.defer();

  Alarm.findOne({ _id: id }).exec(function(err, alarm) {
    if (err) {
      if (err.name === 'CastError' && err.type === 'ObjectId')
        return deferred.reject(new errors.AlarmNotFoundError(id));
      else return deferred.reject(err);
    }

    if (!alarm) return deferred.reject(new errors.AlarmNotFoundError(id));

    deferred.resolve(alarm);
  });

  return deferred.promise;
}

function read(alarm) {
  var deferred = Q.defer();

  Alarm.update({
    _id: alarm.id,
    read: false
  }, {
    read: true
  }, function(err) {
    if (err) return deferred.reject(err);

    alarm.read = true;

    deferred.resolve(alarm);
  });

  return deferred.promise;
}

var createMemberAlarm = function(target, type, group, user) {
  return {
    for: target,
    type: type,
    group: {
      id: group.id,
      name: group.name,
      has_photo: group.has_photo,
      photo: common.getGroupPhoto(group.id, group.has_photo)
    },
    user: {
      id: user.id,
      name: user.name,
      has_photo: user.has_photo,
      photo: common.getUserPhoto(user.id, user.has_photo)
    }
  };
};

var createCardAlarm = function(target, type, group, card, user) {
  var alarm = {
    for: target,
    type: type,
    group: {
      id: group.id,
      name: group.name,
      has_photo: group.has_photo,
      photo: common.getGroupPhoto(group.id, group.has_photo)
    },
    card: {
      id: card.id,
      title: card.title,
      type: card.type
    }
  };

  if (user) {
    alarm.user = {
      id: user.id,
      name: user.name,
      has_photo: user.has_photo,
      photo: common.getUserPhoto(user.id, user.has_photo)
    };
  }

  return alarm;
};

var createGroupAlarm = function(target, type, group, user) {
  var alarm = {
    for: target,
    type: type,
    group: {
      id: group.id,
      name: group.name,
      has_photo: group.has_photo,
      photo: common.getGroupPhoto(group.id, group.has_photo)
    }
  };

  if (user) {
    alarm.user = {
      id: user.id,
      name: user.name,
      has_photo: user.has_photo,
      photo: common.getUserPhoto(user.id, user.has_photo)
    };
  }

  return alarm;
};


/**
 * 
 * SOKET.IO Realtime 
 * 
 */

// for Group
function groupUpdated(group) {
  console.log('group updated : ', group);

  var alarms = _.chain(group.members).filter(function(member) {
    console.log('member : ', member);
    return !member.member.equals(group.owner);
  }).map(function(member) {
    return createGroupAlarm(member.member, 'GROUP_UPDATED', group);
  }).value();

  console.log('group updated alarm : ', alarms);

  Alarm.create(alarms)
    .then(function() {
      // console.log('group updated alarm create : ', arguments);
      
      _.forEach(arguments, function(alarm) {
        console.log('group updated alarm create : ', alarm);
        io.send(alarm.for, 'alarm', alarm);
      });
    });
}

function groupRemoved(group) {
  console.log('group removed : ', group);
 
  var alarms = _.chain(group.members).filter(function(member) {
    console.log('member : ', member);
    return !member.member.equals(group.owner);
  }).map(function(member) {
    return createGroupAlarm(member.member, 'GROUP_REMOVED', group);
  }).value();

  console.log('group removed alarm : ', alarms);

  Alarm.create(alarms)
    .then(function() {
      console.log('group removed alarm create : ', arguments);

      _.forEach(arguments, function(alarm) {
        io.send(alarm.for, 'alarm', alarm);
      });
    });
}

// for Card
function cardPublished(card, user) {
  var group = card.group;

  var alarms = _.chain(group.members).filter(function(member) {
    return !member.member.equals(user.id);
  }).map(function(member) {
    return createCardAlarm(member.member, 'CARD_PUBLISHED', group, card, user);
  }).value();

  Alarm.create(alarms)
    .then(function() {
      _.forEach(arguments, function(alarm) {
        io.send(alarm.for, 'alarm', alarm);
      });
    });
}

function cardResponded(card, user) {
  var group = card.group;

  var alarms = _.chain(group.members).filter(function(member) {
    return !member.member.equals(user.id);
  }).map(function(member) {
    return createCardAlarm(member.member, 'CARD_RESPONDED', group, card, user);
  }).value();

  _.forEach(alarms, function(alarm) {
    io.send(alarm.for, 'alarm', alarm);
  });
}

function cardCompleted(card, auto) {
  var group = card.group;
  var user = card.owner;

  var chain = _.chain(group.members);

  if (!auto) {
    chain = chain.filter(function(member) {
      return !member.member.equals(user);
    });
  }

  chain = chain.map(function(member) {
    return createCardAlarm(member.member, 'CARD_COMPLETED', group, card);
  });

  var alarms = chain.value();

  Alarm.create(alarms)
    .then(function() {
      _.forEach(arguments, function(alarm) {
        io.send(alarm.for, 'alarm', alarm);
      });
    });
}

// for Member
function memberRequested(group, user) {
  var alarm = createMemberAlarm(group.owner, 'MEMBER_REQUESTED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}

function memberApproved(group, user) {
  var alarm = createMemberAlarm(user.id, 'MEMBER_APPROVED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}

function memberDenied(group, user) {
  var alarm = createMemberAlarm(user.id, 'MEMBER_DENIED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}

function memberBanned(group, user) {
  var alarm = createMemberAlarm(user.id, 'MEMBER_BANNED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}

function memberInvited(group, user) {
  var alarm = createMemberAlarm(user.id, 'MEMBER_INVITED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}

function memberLeaved(group, user) {
  var alarm = createMemberAlarm(group.owner, 'MEMBER_LEAVED', group, user);

  Alarm.create(alarm)
    .then(function(alarm) {
      io.send(alarm.for, 'alarm', alarm);
    });
}
