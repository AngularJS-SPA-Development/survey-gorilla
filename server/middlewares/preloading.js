'use strict';

var UserService = localrequire.UserService(),
    GroupService = localrequire.GroupService(),
    CardService = localrequire.CardService();
    // Alarm = localrequire.service('alarm');

exports.requiresMe = function(req, res, next) {
  UserService
    .preload(req.login.id)
    .then(function(user) {
      req.me = user;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.requiresUser = function(req, res, next) {
  UserService
    .preload(req.params.id)
    .then(function(user) {
      req.user = user;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

// exports.requiresUserFromMe = function(req, res, next) {
//   req.user = req.me;
//   next();
// };

exports.requiresGroup = function(req, res, next) {
  GroupService
    .preload(req.params.id)
    .then(function(group) {
      req.group = group;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.requiresGroupFromBody = function(req, res, next) {
  GroupService
    .preload(req.body.group)
    .then(function(group) {
      req.group = group;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.requiresGroupFromCard = function(req, res, next) {
  GroupService
    .preload(req.card.group)
    .then(function(group) {
      req.group = group;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.requiresGroupFromQuery = function(req, res, next) {
  GroupService
    .preload(req.query.group)
    .then(function(group) {
      req.group = group;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.requiresCard = function(req, res, next) {
  CardService
    .preload(req.params.id)
    .then(function(card) {
      req.card = card;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

// exports.requiresAlarm = function(req, res, next) {
//   Alarm.preload(req.params.alarm)
//   .then(function(alarm) {
//     req.alarm = alarm;
//     next();
//   })
//   .catch(function(err) {
//     next(err);
//   });
// };
