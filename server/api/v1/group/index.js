'use strict';

var express = require('express'),
    controller = require('./group.controller'),
    auth = localrequire.AuthService(); //('../../../auth/auth.service.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;