(function() {

  'use strict';

  angular
    .module('surveyGorillaApp', [
		  'sg.app'
		])
    .config(config)
    .factory('authInterceptor', authInterceptor)
    .run(run);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider, config) {
    RestangularProvider.setBaseUrl(config.api_version);
    
    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('sgHttpInterceptor');
  }

  /* @ngInject */
  function run($rootScope, $location, Auth, gettextCatalog) {
    // gettext
    $rootScope.setLang = function(lang) {
      if(lang) {
        gettextCatalog.currentLanguage = lang;
      } else {
        gettextCatalog.currentLanguage = 'ko_KR';
      }
    }

    $rootScope.setLang();

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          $location.path('/login');
        }
      });
    });
  }

  /* @ngInject */
  function authInterceptor($rootScope, $q, storage, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if (storage.get('token')) {
          config.headers.Authorization = 'Bearer ' + storage.get('token');
        }
        
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          storage.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }

})();  