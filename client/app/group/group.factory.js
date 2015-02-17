(function() {
  'use strict';
  angular
    .module('surveyGorillaApp')
    .factory('Group', GroupFactory);

  /* @ngInject */
  function GroupFactory($http, $q) {

    var group = {
      setData: function(groupData) {
        angular.extend(this, groupData);
      },
      load: function(id) {
        if(!id) {
          id = '';
        } 

        var self = this;
        var deferred = $q.defer();
        $http
          .get('api/v1/groups/' + id)
          .success(function(groupData) {
            self.setData(groupData);
            deferred.resolve(groupData);
          })
          .error(function() {
            deferred.reject();
          });

        return deferred.promise;
      },
      delete: function(id) {
        $http.delete('api/v1/groups/' + id);
      },
      update: function(id) {
        $http.put('api/v1/groups/' + id, this);
      },
      isAvailable: function() {
        if(!this.group.members || this.group.members.length === 0) {
          return false;
        }
        return true;
      }
    }

    return group;
  }

})();