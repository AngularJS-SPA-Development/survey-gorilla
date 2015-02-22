(function() {
  'use strict';

  angular
    .module('sg.base', [
      'ngResource',
      'ngSanitize',
      'ngCookies',
      'ui.router',
      'ui.bootstrap',
      'angularFileUpload'
    ])
    .run(run);

  /* @ngInject */
  function run($rootScope, pubsub) {
    pubsub.init($rootScope);
  }
})();