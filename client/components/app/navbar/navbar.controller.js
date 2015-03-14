(function() {
  'use strict';

  angular
    .module('sg.app')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, $timeout, Auth, pubsub) {
    $scope.logout = logout;
    $scope.isActive = isActive;
    _init();
    _subscribe();

    function _init() {
      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn();
      $scope.isAdmin = Auth.isAdmin();
      $scope.currentUser = Auth.getCurrentUser();
    }
    
    function logout() {
      Auth.logout();
      $timeout(function() {
        _init();
      }, 200);
      $location.path('/login');
    }

    function isActive(route) {
      return route === $location.path();
    }

    function _subscribe() {
      pubsub.subscribe('login', function() {
        $timeout(function() {
          _init();
        }, 200);
      })
    }
  }

})();  
