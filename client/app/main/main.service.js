(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('MainSvc', MainSvc);

  /* @ngInject */
  function MainSvc($http) {
    this.getThings = getThings; 
    this.addThing = addThing;
    this.deleteThing = deleteThing;

    function getThings() {
      return $http.get('/api/things');
    }

    function addThing(thing) {
      return $http.post('/api/things', thing);
    }

    function deleteThing(id) {
      return $http.delete('/api/things/' + id);
    }
  }

})();