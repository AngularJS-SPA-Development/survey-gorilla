(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('SignupCtrl', SignupCtrl);

  /* @ngInject */
  function SignupCtrl($scope, Auth, $location, $window, pubsub, alarm) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = register;
    $scope.loginOauth = loginOauth;

    function register(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // 로그인 성공하면 socket.io 생성 
          alarm.initSocketIO(); 
          
          pubsub.publish('login');
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
    
    function loginOauth(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }

})();