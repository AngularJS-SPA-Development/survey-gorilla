(function () {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('MainCtrl', MainCtrl);

  /* @ngInject */
  function MainCtrl($scope, group, modal, logger, sgAlert) {
    var vm = this;
    vm.createGroup = createGroup;
    vm.showGroupDetail = showGroupDetail;
    _init(); 
    
    function _init() {
      // change it to $watch
      //_groups(true);
      //_groups(false);
    }

    function _groups(isMyGroup, params) {
      group 
        .getGroups(isMyGroup, params)
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

    function showGroupDetail(group, type) {
      modal
        .open('', 'read-group.html', 'ReadGroupCtrl', {group: group, type: type})
        .then(function(result){
          if(result && result.memberEnroll) {
            delete result.memberEnroll;
            vm.otherGroups = _.without(vm.otherGroups, result);
            vm.myGroups.unshift(result);
          }

          if(result && result.memberLeave) {
            delete result.memberLeave;
            vm.myGroups = _.without(vm.myGroups, result);
            vm.otherGroups.unshift(result);
          }

          logger.info('read group result: ', result);
        }, function(error) {});
    }

    $scope.$watch(function() { 
      return vm.myGroupName; 
    }, function(newVal, oldVal) {
      _groups(true, {name: vm.myGroupName});
    });

    $scope.$watch(function() { 
      return this.otherGroupName; 
    }, function(newVal, oldVal) {
      _groups(false, {name: vm.otherGroupName});
    });
    
  }

})();