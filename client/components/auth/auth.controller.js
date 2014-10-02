(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('AuthCtrl', AuthCtrl);

  /* @ngInject */
  function AuthCtrl($location, Auth) {
    Auth.loginOAuth(function() {
      $location.path('/');
    });
  }

})();