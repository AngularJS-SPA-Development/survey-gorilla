'use strict';

GLOBAL.localrequire = {
  app: function() {
    return require('../../app');
  }, 
  config: function() {
    return require('../../config/environment');
  },
  common: function() {
    return require('./common');
  },
  test: function() {
    return require('./test');
  },
  UserService: function() {
    return require('../../api/v1/user/user.service');
  },
  User: function() {
    return require('../../api/v1/user/user.model');
  },
  GroupService: function() {
    return require('../../api/v1/group/group.service');
  },
  Group: function() {
    return require('../../api/v1/group/group.model');
  },
  AuthService: function() {
    return require('../../auth/auth.service');
  },
  // add localrequire
  domain: function(domain, name) {
    return require('../../api/v1/' + domain + '/' + name);
  },
  middleware: function(name) {
    return require('../../middlewares/' + name);
  },
  module: function(name) {
    return require('./' + name);
  }
};