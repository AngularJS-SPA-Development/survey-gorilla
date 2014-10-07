(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('AuthCtrl', AuthCtrl);

  /* @ngInject */
  function AuthCtrl($rootScope, $location, Auth) {
    Auth.loginOAuth(function() {
      $rootScope.isOAuthLogin = true;
      $location.path('/');
    });
  }

})();