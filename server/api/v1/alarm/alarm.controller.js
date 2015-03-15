'use strict';

var AlarmService = localrequire.AlarmService(),
    _ = require('lodash'),
    errors = localrequire.config('errors');

var getRead = function(read) {
  switch (read) {
    case 'READ':
      return true;
    case 'UNREAD':
      return false;
    case 'ALL':
    case undefined:
      return undefined;
    default:
      throw new errors.ParamInvalidError('read');
  }
};

var getSort = function(sort) {
  switch (sort) {
    case 'CREATED':
      return {
        by: 'created_at',
        desc: false
      };
    case '-CREATED':
    case undefined:
      return {
        by: 'created_at',
        desc: true
      };
    default:
      throw new errors.ParamInvalidError('sort');
  }
};

exports.list = function(req, res, next) {
  var read = getRead(req.query.read);
  var sort = getSort(req.query.sort);

  AlarmService
    .list({
      for: req.user.id,
      read: read,
      sort: {
        by: sort.by,
        desc: sort.desc,
        lt: req.query.lt,
        lte: req.query.lte,
        gt: req.query.gt,
        gte: req.query.gte
      },
      limit: req.query.limit
    }, req.user).then(function(alarms) {
      res.finish(200, alarms);
    }).catch(function(err) {
      next(err);
    });
};

exports.read = function(req, res, next) {
  AlarmService
    .read(req.alarm)
    .then(function(alarm) {
      res.finish(200, alarm);
    }).catch(function(err) {
      next(err);
    });
};
