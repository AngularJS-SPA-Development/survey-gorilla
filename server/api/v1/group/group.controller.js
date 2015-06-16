'use strict';

var GroupService = require('./group.service'),
    photoUtils = localrequire.module('photo'),
    util = localrequire.module('util');

exports.list = list;
exports.read = read;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var getMember = function(type, user) {
  switch (type) {
    case 'RELATED':
      return {
        id: user,
        inverse: false
      };
    case 'UNRELATED':
      return {
        id: user,
        inverse: true
      };
    case 'ALL':
    case undefined:
      return {};
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
    default:
      throw new errors.ParamInvalidError('sort');
  }
};

// Get list of group
function list(req, res, next) {
  var member = getMember(req.query.type, req.user.id); //req.login.id);
  var sort = getSort(req.query.sort);

  var options = {
    name: req.query.name,
    member: {
      id: member.id,
      inverse: member.inverse
    },
    sort: {
      by: sort.by,
      desc: sort.desc,
      lt: req.query.lt,
      lte: req.query.lte,
      gt: req.query.gt,
      gte: req.query.gte
    },
    limit: req.query.limit
  };

  GroupService
    .list(options)
    .then(function(groups) {
      res.finish(200, groups);
    })
    .catch(function(err) {
      next(err);
    });
};

// Get a single group
function read(req, res, next) {
  GroupService
    .read(req.params.id)
    .then(function(group) {
      res.finish(group);
    })
    .catch(function(err) {
      // if(err.code === 'GROUP_NOT_FOUND') {
      //   return res.send(404);
      // } 
      // res.send(500, err);
      next(err);
    });
};

// Creates a new group in the DB.
function create(req, res, next) {
  GroupService
    .create(req.body, req.user)
    .then(function(group) {
      res.finish(201, group);
    })
    .catch(function(err) {
      next(err);
    });
};

// Updates an existing group in the DB.
function update(req, res, next) {
  if(req.body._id) { delete req.body._id; }

  GroupService
    .update(req.params.id, req.body)
    .then(function(group) {
      res.finish(201, group);
    })
    .catch(function(err) {
      // if(err.code === 'GROUP_NOT_FOUND') {
      //   return res.send(404);
      // } 
      // res.send(500, err);
      next(err);
    });
};

// Deletes a group from the DB.
function destroy(req, res, next) {
  GroupService
    .destroy(req.params.id)
    .then(function(group) {
      res.finish(204);
    })
    .catch(function(err) {
      // if(err.code === 'GROUP_NOT_FOUND') {
      //   return res.send(404);
      // } 
      // res.send(500, err);
      next(err);
    });
};

exports.photo = {
  upload: function(req, res, next) {
    var group = req.group;
    var photo = req.files.photo;

    if (photo && photo.path) {
      // 600 파일의 width 조정 
      photoUtils.read(photo.path, 600)
        .then(function(data) {
          return GroupService.photo.upload(group, data);
        })
        .then(function(group) {
          res.writeHead('200', { 'Content-Type': 'image/png' });
          res.end(group.photo, 'base64');
        })
        .catch(function(err) {
          next(err);
        });
    } else {
      next(new errors.PhotoRequiredError());
    }
  },

  download: function(req, res, next) {
    GroupService
      .photo.download(req.group)
      .then(function(group) {
        var photo = group.photo;
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

// member auto enroll
exports.members = {
  enroll: function (req, res, next) {
    GroupService.members
      .enroll(req.group, req.user)
      .then(function() {
        res.finish();
      }).catch(function(err) {
        next(err);
      });
  },
  leave: function(req, res, next) {
    GroupService.members
      .leave(req.group, req.user)
      .then(function() {
        res.finish();
      }).catch(function(err) {
        next(err);
      });
  }
};

