(function() {
  'use strict';

  angular
    .module('sg.app')
    .controller('AuthCtrl', AuthCtrl);

  /* @ngInject */
  function AuthCtrl($rootScope, $location, Auth) {
    Auth.loginOAuth(function() {
      $rootScope.isOAuthLogin = true;
      $location.path('/');
    });
  }

})();