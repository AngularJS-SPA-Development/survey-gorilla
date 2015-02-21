(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .factory('Cards', Cards);

  function Cards(Restangular) {
    var model = Restangular.all('cards');
    model.one = function(id) {
      return Restangular.one('cards', id);
    };
    return model;
  }

})();