(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location, $timeout, Auth, alarm, pubsub, sgDate, logger) {
    var vm = this;
    vm.logout = logout;
    vm.isActive = isActive;
    vm.readAlarm = readAlarm;
    _init();
    _subscribe();

    function _init() {
      vm.isCollapsed = true;
      vm.isLoggedIn = Auth.isLoggedIn();
      vm.isAdmin = Auth.isAdmin();
      vm.currentUser = Auth.getCurrentUser();
      if(vm.isLoggedIn) {
        _initAlarms();
      }
    }

    function _initAlarms() {
      vm.alarms = [];

      alarm
        .getAlarms()
        .then(function(response) {
          vm.alarms = response.data;
          _makeAlarm(vm.alarms);
        });
    }

    function _makeAlarm(alarms) {
      if(!alarms || alarms.length==0) { return; }

      angular.forEach(alarms, function(alarm) {
        alarm.created_at = sgDate.fromNow(alarm.created_at);
        if(alarm.type === 'CARD_PUBLISHED') {
          alarm.msg = 'published card - ' + alarm.card.title;
        } else if(alarm.type === 'CARD_COMPLETED') {
          alarm.msg = 'completed card - ' + alarm.card.title;
        } 
      });
    }

    // read alarm 
    function readAlarm(alarmId) {
      alarm
        .readAlarm(alarmId)
        .then(function(response) {
          logger.info('check alarm:', response.data);
          vm.alarms = _.filter(vm.alarms, function(alarm) {
            if(alarm.id !== alarmId) { 
              return alarm; 
            }
          });
        });
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