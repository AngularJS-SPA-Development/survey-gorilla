(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('MainCtrl', MainCtrl);

  /* @ngInject */
  function MainCtrl($scope, $http, socket, MainSvc) {
    init(); 
    
    $scope.addThing = addThing;
    $scope.deleteThing=  deleteThing;

    function init() {
      $scope.awesomeThings = [];

      MainSvc.getThings().success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        socket.syncUpdates('thing', $scope.awesomeThings);
      });
    }
    
    function addThing() {
      if($scope.newThing === '') {
        return;
      }
      MainSvc.addThing({ name: $scope.newThing });
      $scope.newThing = '';
    };

    function deleteThing(thing) {
      MainSvc.deleteThing(thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

})();