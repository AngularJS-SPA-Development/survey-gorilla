(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('GroupCreateCtrl', GroupCreateCtrl);
    
  /* @ngInject */
  function GroupCreateCtrl($scope, $state, $stateParams, groupSvc) {
    // group 인스턴스 생성. UI에서 ng-model로 group 인스턴스 속성 설정
    $scope.group = groupSvc.newGroup();  
   
    // group 저장. POST 메소드 /api/v1/groups 요청
    $scope.addGroup = function() { 
      groupSvc.addGroup($scope.group).then(function() {
        $state.go('groups'); // group 관리 화면으로 이동
      }, function() { /* error */ });
    };
  }

})();