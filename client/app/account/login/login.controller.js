(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($scope, Auth, $location, $window, pubsub, alarm) {
    $scope.user = {};
    $scope.errors = {};
    $scope.login = login;
    $scope.loginOauth = loginOauth;

    function login(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // 로그인 성공하면 socket.io 생성 
          alarm.initSocketIO(); 
          
          pubsub.publish('login');
          $location.path('/');
        })
        .catch( function(err) {
          console.log('login.controller.js : login error is ', err.message);
        });
      }
    };
    
    function loginOauth(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }
  
})();
