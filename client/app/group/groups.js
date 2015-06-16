(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .factory('Groups', Groups);

  function Groups(Restangular) {
    var model = Restangular.all('groups');
    model.one = function(id) {
      return Restangular.one('groups', id);
    };
    return model;
  }

})();