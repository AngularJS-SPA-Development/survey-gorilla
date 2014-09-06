
(function() {

  'use strict';
  angular
    .module('surveyGorillaApp')
    .controller('GroupListCtrl', GroupListCtrl)
    .controller('GroupViewCtrl', GroupViewCtrl)
    .controller('GroupCreateCtrl', GroupCreateCtrl)
    .controller('GroupEditCtrl', GroupEditCtrl);

  /* @ngInject */
  function GroupListCtrl($scope, $window, groupSvc) {
    // 전체 groups 받기. GET 메소드 /api/groups 요청
    $scope.groups = groupSvc.getGroups(); 
   
    // group 삭제.  DELETE 메소드 /api/groups/:id 요청
    $scope.deleteGroup = function(group) { 
      groupSvc.deleteGroup(group).then(function() {
        $window.location.href = ''; //redirect 메인
      }, function() { /* error */ });
    };
  }

  /* @ngInject */
  function GroupViewCtrl($scope, $stateParams, groupSvc) {
    // 1개 group 받기. GET 메소드 /api/groups/:id 요청
    $scope.group = groupSvc.getGroup($stateParams.id); 
  }

  /* @ngInject */
  function GroupCreateCtrl($scope, $state, $stateParams, groupSvc) {
    // group 인스턴스 생성. UI에서 ng-model로 group 인스턴스 속성 설정
    $scope.group = groupSvc.newGroup();  
   
    // group 저장. POST 메소드 /api/groups 요청
    $scope.addGroup = function() { 
      groupSvc.addGroup($scope.group).then(function() {
        $state.go('groups'); // group 관리 화면으로 이동
      }, function() { /* error */ });
    };
  }

  /* @ngInject */
  function GroupEditCtrl($scope, $state, $stateParams, groupSvc) {
    // group 갱신. PUT 메소드 /api/groups/:id 요청
    $scope.updateGroup = function() { 
      groupSvc.updateGroup($scope.group).then(function() {
        $state.go('groups'); // group 관리 화면으로 이동
      }, function() { /* error */ });
    };
    
    // 1개 group 받기. GET 메소드 /api/groups/:id 요청
    $scope.group = groupSvc.getGroup($stateParams.id);
  }

})();
