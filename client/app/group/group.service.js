(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('groupSvc', groupSvc);

  /* @ngInject */
  function groupSvc(Group) {
    this.getGroups = getGroups;
    this.deleteGroup = deleteGroup;
    this.getGroup = getGroup;
    this.newGroup = newGroup;
    this.addGroup = addGroup;
    this.updateGroup = updateGroup;

    function getGroups() {
      return Group.query();
    }

    function deleteGroup(group) {
      return group.$delete();
    }

    function getGroup(_id) {
      Group.get({ id: _id });
    }

    function newGroup() {
      return new Group();
    }

    function addGroup(group) {
      return group.$save();
    }

    function updateGroup(group) {
      return group.$update();
    }
  }

})();