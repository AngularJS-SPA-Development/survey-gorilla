(function() {
  'use strict';

  angular
    .module('sg.app')
    .factory('sgHttpInterceptor', Sghttpinterceptor);

  /* @ngInject */
  function Sghttpinterceptor($q, sgAlert) {
    
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
      if(msg) {
        if(rejection.data.message) {
          msg.value = rejection.data.message;
        }
        sgAlert.error(msg.value, msg.code);
      }

      return $q.reject(rejection);
    }

    function httpType(status) {
      var msg = null;
      if(status === 400) {
        msg = { 
          code : 'BAD_REQUEST',
          value : 'You send a Bad Request. send the right thing.'
        };
      } else if(status === 401) {
        msg = { 
          code : 'UNAUTHORIZED',
          value : 'Login Required. Or Your login info is expired.'
        };
      } else if(status === 403) {
        msg = { 
          code : 'FORBIDDEN',
          value : 'Your Authorized is forbidden. Request the autorization to administrator.'
        };
      } else if(status === 404) {
        msg = { 
          code : 'NOT_FOUND',
          value : 'Not found the content.'
        };
      } else if(status === 422) {
        msg = { 
          code : 'SYMANTIC ERROR',
          value : 'Check your email because it maybe duplicated.'
        };
      } else if(status === 500) {
        msg = { 
          code : 'SERVER_ERROR',
          value : 'Internal Server Error'
        };
      }

      return msg;
    }
  }

})();