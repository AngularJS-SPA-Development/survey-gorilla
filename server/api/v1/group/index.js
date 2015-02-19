'use strict';

var express = require('express'),
    controller = require('./group.controller'),
    auth = localrequire.AuthService(), //('../../../auth/auth.service.js');
    preloading = localrequire.middleware('preloading');

var router = express.Router();

router.get('/', [
  auth.isAuthenticated(), 
  controller.list
]);
router.get('/:id', [
  auth.isAuthenticated(), 
  controller.read
]);
router.post('/', [
  auth.isAuthenticated(), 
  controller.create
]);
router.put('/:id', [
  auth.isAuthenticated(), 
  controller.update
]);
router.patch('/:id', [
  auth.isAuthenticated(), 
  controller.update
]);
router.delete('/:id', [
  auth.isAuthenticated(), 
  controller.destroy
]);

// image uploading
router.get('/:id/photo', [
  preloading.requiresGroup,
  controller.photo.download
]);

router.put('/:id/photo', [
  auth.isAuthenticated(),
  preloading.requiresGroup,
  controller.photo.upload
]);

// enroll
router.post('/:id/members/enroll', [
  auth.isAuthenticated(),
  preloading.requiresGroup,
  controller.members.enroll
]);

router.post('/:id/members/leave', [
  auth.isAuthenticated(),
  preloading.requiresGroup,
  controller.members.leave
]);

module.exports = router;