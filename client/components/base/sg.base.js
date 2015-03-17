(function() {
  'use strict';

  angular
    .module('sg.base', [
      'ngResource',
      'ngSanitize',
      'ngCookies',
      'ngAnimate',
      'ui.router',
      'ui.bootstrap',
      'angularFileUpload',
      'infinite-scroll'
    ])
    .run(run);

  /* @ngInject */
  function run($rootScope, pubsub) {
    pubsub.init($rootScope);
  }
})();