'use strict';

var GroupService = require('./group.service');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

// Get list of group
function index(req, res) {
  GroupService
    .index()

    .then(function(groups) {
      res.json(200, groups);
    })
    .catch(function(err) {
      res.send(500, err);
    });
};

// Get a single group
function show(req, res) {
  GroupService
    .show(req.params.id)

    .then(function(group) {
      res.json(group);
    })
    .catch(function(err) {
      if(err.code === 'NOT_FOUND') {
        return res.send(404);
      } 
      res.send(500, err);
    });
};

// Creates a new group in the DB.
function create(req, res) {
  GroupService
    .create(req.body, req.user)

    .then(function(group) {
      res.json(201, group);
    })
    .catch(function(err) {
      res.send(500, err);
    });
};

// Updates an existing group in the DB.
function update(req, res) {
  if(req.body._id) { delete req.body._id; }

  GroupService
    .update(req.params.id, req.body)

    .then(function(group) {
      res.json(201, group);
    })
    .catch(function(err) {
      if(err.code === 'NOT_FOUND') {
        return res.send(404);
      } 
      res.send(500, err);
    });
};

// Deletes a group from the DB.
function destroy(req, res) {
  GroupService
    .destroy(req.params.id)

    .then(function(group) {
      res.send(204);
    })
    .catch(function(err) {
      if(err.code === 'NOT_FOUND') {
        return res.send(404);
      } 
      res.send(500, err);
    });
};
