(function() {
  'use strict';
  angular
    .module('surveyGorillaApp')
    .service('groupManager', GroupManager);

  /* @ngInject */
  function GroupManager($http, $q, Group) {

    this.getGroup = getGroup;
    this.setGroup = setGroup;

    var _store = {};
    var _getGroupInstance = function(id, groupData) {
      var instance = this._store[id];
      if(instance) {
        instance.setData(groupData);
      } else {
        instance = new Group(groupData);
        this._store[id] = instance;
      }
      return instance;
    }

    var _search = function(id) {
      return this._store[id];
    }

    var _load = function(id, deferred) {
      var self = this
        , group = new Group();

      group
        .load(id)
        .then(function(groupData) {
          var group = self._getGroupInstance(groupData.id, groupData);
          deferred.resolve(group);
        }, function() {
          deferred.reject();
        });
    }
  }

  function getGroup(id) {
    var deferred = $q.defer()
      , group = this._search(id);

    if (group) {
        deferred.resolve(group);
    } else {
        this._load(id, deferred);
    }
    return deferred.promise;
  }

  function setGroup(groupData) {
    var self = this
      , group = this._search(groupData.id);
    if (group) {
      group.setData(groupData);
    } else {
      group = self._getGroupInstance(groupData);
    }
    return group;
  }

})();
