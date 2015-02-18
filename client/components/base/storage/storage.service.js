(function() {
  'use strict';

  /**
   * change storageService to storage
   */
  angular
    .module('sg.base')
    .service('storage', storage);

  function storage() {
    this.setValue = function(key, value, options) {
      angular.element.jStorage.set(key, value, options);
    };

    this.put = function(key, value, options) {
      this.setValue(key, value, options);
    }

    this.getValue = function(key) {
      return angular.element.jStorage.get(key);
    };

    this.get = function(key) {
      return this.getValue(key);
    }

    this.removeValue = function(key) {
      angular.element.jStorage.deleteKey(key);
    };

    this.remove = function(key) {
      this.removeValue(key);
    }

    this.flush = function() {
      angular.element.jStorage.flush();
    };

    // ttl is milliseconds
    this.setTTL = function(key, ttl) {
      angular.element.jStorage.setTTL(key, ttl);
    };
  }

})();