(function() {

  'use strict';

  /**
   * Chrome console object logger
   */
  angular
    .module('sg.base')
    .service('logger', logger);

  /* @ngInject */
  function logger($log) {
    var enable = true;
    this.enableLogging = enableLogging;

    this.info = info;
    this.debug = debug;
    this.warn = warn;
    this.error = error;
    this.trace = trace;

    function enableLogging(isEnable) {
      enable = isEnable;
    }

    function info() {
      _logging('info', arguments);
    }

    function debug() {
      _logging('debug', arguments);
    }    

    function warn() {
      _logging('warn', arguments);
    }

    function error() {
      _logging('error', arguments);
    }

    function trace() {
      _logging('trace', arguments);
    }

    function _logging(type, params) {
      if(!enable) { return; }

      for (var i = 0; i < params.length; i++) {
        try {
          $log[type](params[i]);
        } catch(err) {
          console.log(params[i]);
        }
      }
    }
  }
})();