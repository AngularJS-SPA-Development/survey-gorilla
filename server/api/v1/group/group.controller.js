'use strict';

var GroupService = require('./group.service');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

// Get list of group
function index(req, res, next) {
  var userid = undefined;
  if(req.user) {
    userid = req.user.id;
  }
  var options = {
    name: req.query.name,
    member: {
      id: userid,
      inverse: req.query.inverse
    },
    sort: {
      by: req.query.sort,
      lt: req.query.lt,
      lte: req.query.lte,
      gt: req.query.gt,
      gte: req.query.gte
    },
    limit: req.query.limit
  };

  GroupService
    .index(options)
    .then(function(groups) {
      res.finish(200, groups);
    })
    .catch(function(err) {
      next(err);
    });
};

// Get a single group
function show(req, res, next) {
  GroupService
    .show(req.params.id)

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
