(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($scope, Auth, $location, $window) {
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
