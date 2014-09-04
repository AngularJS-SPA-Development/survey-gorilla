(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('GroupCtrl', GroupCtrl);

  /* @ngInject */
  function GroupCtrl($scope, $log, Group, groupManager) {
    var group = new Group();
    group.load(1).then(function(groupData) {
      $scope.group = groupData;
    });

    groupManager.getGroup(1).then(function(groupData){
      $scope.group = groupData;
    });
  }

})();