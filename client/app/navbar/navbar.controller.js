(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, $timeout, Auth, pubsub, logger) {
    var vm = this;
    vm.logout = logout;
    vm.isActive = isActive;
    _init();
    _subscribe();

    function _init() {
      vm.isCollapsed = true;
      vm.isLoggedIn = Auth.isLoggedIn();
      vm.isAdmin = Auth.isAdmin();
      vm.currentUser = Auth.getCurrentUser();
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
      });

      // When ocurred alarm, retry to initialize alarms.
      pubsub.subscribe('alarm:header', function() {
        _initAlarms();
      });
    }
  }

})();  