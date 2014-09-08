(function() {

  'use strict';
  angular
    .module('surveyGorillaApp')
    .factory('sgHttpInterceptor', Sghttpinterceptor);

  /* @ngInject */
  function Sghttpinterceptor($q) {
    
    return {
      'request': request,
      'requestError': requestError,
      'response': response,
      'responseError': responseError
    };

    function request(config) {
      return config;
    }

    function requestError(rejection) {
      return $q.reject(rejection);
    }

    function response(response) {
      return response;
    }

    function responseError(rejection) {
      var msg = httpType(rejection.status);
      // popup messeage window like noty
      // multi-language setup
      return $q.reject(rejection);
    }

    function httpType(status) {
      var msg = null;
      if(status === 400) {
        msg = { 
          code : 'BAD_REQUEST',
          txt : 'You send a Bad Request. send the right thing.'
        };
      } else if(status === 401) {
        msg = { 
          code : 'UNAUTHORIZED',
          txt : 'Login Required. Or Your login info is expired.'
        };
      } else if(status === 403) {
        msg = { 
          code : 'FORBIDDEN',
          txt : 'Your Authorized is forbidden. Request the autorization to administrator.'
        };
      } else if(status === 404) {
        msg = { 
          code : 'NOT_FOUND',
          txt : 'Not found the content.'
        };
      } else if(status === 500) {
        msg = { 
          code : 'SERVER_ERROR',
          txt : 'Internal Server Error'
        };
      }

      return msg;
    }
  }

})();