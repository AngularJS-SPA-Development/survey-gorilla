(function() {
  'use strict';

  angular
    .module('sg.app')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, Auth, alarm) {
    $scope.menu = [];
    // [{
    //   'title': 'Home',
    //   'link': '/'
    // }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      // socket.io 연결을 끊음 
      alarm.disconnectSocketIO();
      
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }

})();  