(function() {
  'use strict';

  angular
    .module('sg.app')
    .service('group', group);

  /* @ngInject */
  function group(Groups, config, Auth) {
    this.getGroup = getGroup;
    this.getGroups = getGroups;
    this.create = create;
    this.remove = remove;
    this.update = update;
    this.isGroupOwner = isGroupOwner;

    function getGroup(groupId) {
      return Groups.one(groupId).get();
    }

    function getGroups(isOnlyMyGroup, params) {
      var group;
      if(isOnlyMyGroup) {
        group = {type: 'RELATED', sort: '-CREATED'};
      } else {
        group = {type: 'UNRELATED', sort: '-CREATED'}
      }

      if(params) {
        params = angular.extend(group, params);
      } else {
        params = group;
      }

      return Groups.customGET('', params);
    }

    function create(params) {
      return Groups.customPOST(params);
    }

    function remove(groupId) {
      return Groups.one(groupId).customDELETE();
    }

    function update(groupId, params) {
      return Groups.one(groupId).customPUT(params);
    }

    function isGroupOwner(group) {
      if(group && group.owner && Auth.isLoggedIn()) {
        return group.owner.id === Auth.getCurrentUser().id;
      } else {
        return false;
      }
    }
  }
})();