(function() {
  'use strict';

  angular
    .module('sg.app')
    .factory('Groups', Groups);

  function Groups(Restangular, config) {
    var model = Restangular.all(config.api_verion + 'groups');
    model.one = function(id) {
      return Restangular.one(config.api_verion + 'groups', id);
    };
    return model;
  }

})();