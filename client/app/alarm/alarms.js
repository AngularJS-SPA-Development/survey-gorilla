(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .factory('Alarms', Alarms);

  function Alarms(Restangular) {
    var model = Restangular.all('alarms');
    model.one = function(id) {
      return Restangular.one('alarms', id);
    };
    return model;
  }

})();