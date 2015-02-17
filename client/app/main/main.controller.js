(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('MainCtrl', MainCtrl);

  /* @ngInject */
  function MainCtrl($scope, group, modal, logger, sgAlert) {
    var vm = this;
    vm.createGroup = createGroup;
    _init(); 
    

    function _init() {
      $scope.onlyMyGroup = true;
      _groups();
    }

    function _groups() {
      group 
        .getGroups($scope.onlyMyGroup)
        .then(function(response) {
          logger.info('group list: ', response.data);
          vm.groups = response.data;
        }, function(error) {
          sgAlert.error('group list error: ', error);
        });
    }

    function createGroup() {
      modal
        .open('sm', 'create-group.html', 'CreateGroupCtrl')
        .then(function(result){
          logger.info('create group result: ', result);
        }, function(error) {});
    }
    
  }

})();