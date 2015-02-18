(function(){
  'use strict';

  angular
    .module('sg.app')
    .factory('User', User);

  /* @ngInject */
  function User($resource, config) {
    return $resource(config.api_version + '/users/:id/:controller', {
        id: '@_id'
      },
      {
        changePassword: {
          method: 'PUT',
          params: {
            controller:'password'
          }
        },
        get: {
          method: 'GET',
          params: {
            id:'me'
          }
        }
      });
  }

})();