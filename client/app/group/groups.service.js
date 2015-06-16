(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('group', group);

  /* @ngInject */
  function group(Groups, Auth) {
    this.getGroup = getGroup;
    this.getGroups = getGroups;
    this.create = create;
    this.remove = remove;
    this.update = update;
    this.memberEnroll = memberEnroll;
    this.memberLeave = memberLeave;
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

    function memberEnroll(groupId) {
      return Groups.one(groupId).customPOST('', 'members/enroll');
    }

    function memberLeave(groupId) {
      return Groups.one(groupId).customPOST('', 'members/leave');
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