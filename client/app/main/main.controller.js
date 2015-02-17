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
      _groups(true);
      _groups(false);
    }

    function _groups(isMyGroup) {
      group 
        .getGroups(isMyGroup)
        .then(function(response) {
          logger.info('group list: ', response.data);
          if(isMyGroup) {
            vm.myGroups = response.data;
          } else {
            vm.otherGroups = response.data;
          }
        });
    }

    function createGroup() {
      modal
        .open('sm', 'create-group.html', 'CreateGroupCtrl')
        .then(function(result){
          logger.info('create group result: ', result);
          vm.myGroups.unshift(result);
        }, function(error) {});
    }
    
  }

})();