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

    function showGroupDetail(group) {
      modal
        .open('', 'read-group.html', 'ReadGroupCtrl', {group: group})
        .then(function(result){
          logger.info('read group result: ', result);
        }, function(error) {});
    }

    $scope.$watch(angular.bind(this, function() { return this.myGroupName; }), function(newVal, oldVal) {
      _groups(true, {name: vm.myGroupName});
    });

    $scope.$watch(angular.bind(this, function() { return this.otherGroupName; }), function(newVal, oldVal) {
      _groups(false, {name: vm.otherGroupName});
    });
    
  }

})();