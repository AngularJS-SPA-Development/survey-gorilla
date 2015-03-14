'use strict';

var express = require('express'),
    controller = require('./alarm.controller'),
    auth = localrequire.AuthService(),
    preloading = localrequire.middleware('preloading');

var router = express.Router();

router.get('/', [
  auth.isAuthenticated(),
  controller.list
]);

router.get('/:id', [
  auth.isAuthenticated(),
  preloading.requiresAlarm,
  controller.read
]);

router.post('/:id/read', [
  auth.isAuthenticated(),
  preloading.requiresAlarm,
  controller.read
]);

module.exports = router;