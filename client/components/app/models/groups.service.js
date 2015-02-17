(function() {
  'use strict';

  angular
    .module('sg.app')
    .service('group', group);

  /* @ngInject */
  function group(Groups, config) {
    this.getGroup = getGroup;
    this.getGroups = getGroups;
    this.create = create;
    this.remove = remove;
    this.update = update;

    function getGroup(groupId) {
      return Groups.one(groupId).get();
    }

    function getGroups(isOnlyMyGroup) {
      if(isOnlyMyGroup) {
        return Groups.customGET('', {type: 'RELATED', sort: '-CREATED'});
      } else {
        return Groups.customGET('', {type: 'UNRELATED', sort: '-CREATED'});
      }
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
  }
})();