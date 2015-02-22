'use strict';

var express = require('express'),
    controller = require('./card.controller'),
    auth = localrequire.AuthService(),
    preloading = localrequire.middleware('preloading');

var router = express.Router();

router.get('/', [
  auth.isAuthenticated(),
  preloading.requiresGroupFromQuery,
  controller.processQuery,
  controller.list
]);

router.post('/', [
  auth.isAuthenticated(),
  preloading.requiresGroupFromBody,
  controller.create
]);

router.get('/:id', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  preloading.requiresGroupFromCard,
  controller.read
]);

router.put('/:id', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  controller.update
]);

router.delete('/:id', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  controller.delete
]);

router.post('/:id/respond', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  preloading.requiresGroupFromCard,
  controller.respond
]);

router.post('/:id/complete', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  controller.complete
]);

router.get('/:id/photo', [
  preloading.requiresCard,
  controller.photo.download
]);

router.put('/:id/photo', [
  auth.isAuthenticated(),
  preloading.requiresCard,
  controller.photo.upload
]);

module.exports = router;
