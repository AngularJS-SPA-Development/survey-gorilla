(function() {
  'use strict';

  angular
    .module('sg.app', [
      'sg.base',
      'btford.socket-io',
      'gettext',
      'sg.translation',
      'sg.message',
      'restangular'
    ])
    .constant('config', {
      api_version: 'api/v1'
    });

})();