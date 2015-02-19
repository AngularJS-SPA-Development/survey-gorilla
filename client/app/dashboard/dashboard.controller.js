(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $stateParams, group, logger) {
    var vm = this;
    _init();

    function _init() {
      group
        .getGroup($stateParams.id)
        .then(function(response) {
          vm.group = response.data;
          vm.backgroundImage = {
            'background-image': 'url(' + vm.group.photo + ')',
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
          };
          vm.titleFont = {
            'color': 'yellow',
            'text-shadow': '0 0 8px #000',
            '-moz-text-shadow': '0 0 8px #000',
            '-webkit-text-shadow': '0 0 8px #000'
          };
          logger.info('group dashboard: ', vm.group);
        });

      
    }
  }

})();
