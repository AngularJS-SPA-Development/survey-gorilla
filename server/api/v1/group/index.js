'use strict';

var express = require('express'),
    controller = require('./group.controller'),
    auth = localrequire.AuthService(); //('../../../auth/auth.service.js');

var router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.read);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;