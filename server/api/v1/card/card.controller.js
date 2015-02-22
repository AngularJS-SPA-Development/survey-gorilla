'use strict';

var CardService = localrequire.CardService(),
    _ = require('lodash'),
    errors = localrequire.config('errors'),
    photoUtils = localrequire.module('photo'),
    util = localrequire.module('util');

exports.processQuery = processQuery;
exports.list = list;
exports.read = read;
exports.create = create;
exports.update = update;
exports.respond = respond;
exports.complete = complete;

var getTypes = function(type) {
  switch (type) {
    case 'NOTICE':
    case 'RATING':
    case 'SURVEY':
      return [type];
    case 'ALL':
    case undefined:
      return undefined;
    default:
      throw new errors.ParamInvalidError('type');
  }
};

var getCompleted = function(complete) {
  switch (complete) {
    case 'COMPLETE':
      return true;
    case 'INCOMPLETE':
      return false;
    case 'ALL':
    case undefined:
      return undefined;
    default:
      throw new errors.ParamInvalidError('type');
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
    case 'DUE':
      return {
        by: 'due_at',
        desc: false
      };
    case '-DUE':
      return {
        by: 'due_at',
        desc: true
      };
    case 'COMPLETED':
      return {
        by: 'completed_at',
        desc: false
      };
    case '-COMPLETED':
      return {
        by: 'completed_at',
        desc: true
      };
    default:
      throw new errors.ParamInvalidError('sort');
  }
};

function processQuery(req, res, next) {
  var user = req.user;
  var group = req.group;
  var query = req.query;

  if (query.group) {
    var me = _.find(group.members, function(member) {
      return member.member.equals(user.id);
    });

    var available = query.group === group.id && _.contains(['OWNER', 'MEMBER'], me.role);

    if (available) {
      query.groups = [query.group];
      query.users = query.user ? [query.user] : undefined;
      next();
    } else {
      return new errors.NotGroupMemberError();
    }
  } else {
    return new errors.ParamRequiredError('group');
  }
};

function list(req, res, next) {
  var types = getTypes(req.query.type);
  var completed = getCompleted(req.query.complete);
  var sort = getSort(req.query.sort);

  CardService.list({
    title: req.query.title,
    groups: req.query.groups,
    users: req.query.users,
    types: types,
    completed: completed,
    sort: {
      by: sort.by,
      desc: sort.desc,
      lt: req.query.lt,
      lte: req.query.lte,
      gt: req.query.gt,
      gte: req.query.gte
    },
    limit: req.query.limit
  }, req.user).then(function(groups) {
    res.finish(200, groups);
  }).catch(function(err) {
    next(err);
  });
};

function read(req, res, next) {
  CardService.read(req.params.id, req.user)
  .then(function(card) {
    res.finish(200, card);
  }).catch(function(err) {
    next(err);
  });
};

function create(req, res, next) {
  CardService.create(req.body, req.user)
  .then(function(card) {
    res.finish(200, card);
  }).catch(function(err) {
    next(err);
  });
};

function update(req, res, next) {
  delete req.body.id;

  CardService.update(req.card, req.body)
  .then(function(card) {
    res.finish(200, card);
  }).catch(function(err) {
    next(err);
  });
};

exports.delete = function(req, res, next) {
  CardService.delete(req.card)
  .then(function(card) {
    res.finish(200, card);
  }).catch(function(err) {
    next(err);
  });
};

function respond(req, res, next) {
  CardService.respond(req.card, req.body, req.user)
  .then(function() {
    exports.read(req, res, next);
  })
  .catch(function(err) {
    next(err);
  });
};

function complete(req, res, next) {
  CardService.complete(req.card)
  .then(function() {
    exports.read(req, res, next);
  }).catch(function(err) {
    next(err);
  });
};

exports.photo = {
  upload: function(req, res, next) {
    var card = req.card;
    var photo = req.files.photo;

    if (photo && photo.path) {
      photoUtils.read(photo.path, 750)
        .then(function(data) {
          return CardService.photo.upload(card, data);
        })
        .then(function(card) {
          res.writeHead('200', { 'Content-Type': 'image/png' });
          res.end(card.photo, 'base64');
        })
        .catch(function(err) {
          next(err);
        });
    } else {
      next(new errors.PhotoRequiredError());
    }
  },

  download: function(req, res, next) {
    CardService.photo.download(req.card)
    .then(function(card) {
      var photo = card.photo;
      var hash = util.calculateHash(photo);

      if (util.isNotModified(req, hash)) {
        res.writeHead('304', {
          'ETag': hash,
          'Cache-Control': 'public, max-age=86400'
        });
        res.end();
      } else {
        res.writeHead('200', {
          'Content-Type': 'image/png',
          'ETag': hash,
          'Cache-Control': 'public, max-age=86400'
        });
        res.end(photo, 'base64');
      }
    }).catch(function(err) {
      next(err);
    });
  }
};

