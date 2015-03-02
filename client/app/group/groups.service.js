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

  }
})();