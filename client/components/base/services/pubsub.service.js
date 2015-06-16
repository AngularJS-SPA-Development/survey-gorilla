(function() {

  'use strict';

  angular
    .module('sg.base')
    .service('pubsub', pubsub);

  /* @ngInject */
  function pubsub() {
    this.init = init;
    this.subscribe = subscribe;
    this.publish = publish;
    this.clearAll = clearAll;
    this.clear = clear;

    var root = undefined;
    var eventList = [];
    var eventClearFnList = [];

    function init(rootScope) {
      root = rootScope;
    }

    function subscribe(eventName, cb, scope) {
      eventList.push(eventName);
      if(scope) {
        var clearFn = scope.$on(eventName, cb);
        var clearList = _.findWhere(eventClearFnList, {en: eventName, fn: clearFn});
        angular.forEach(clearList, function(idx, cf) {
          cf();
        });

        eventClearFnList.push({en: eventName, fn: clearFn});
      } else {
        return root.$on(eventName, cb);
      }
    }

    function publish(eventName, params) {
      root.$broadcast(eventName, params);
    }

    // not use
    function clearAll() {
      return;

      if(eventList.length === 0) {
        return;
      }

      for(var i=0; i<eventList.length; i++) {
        root.$$listeners[eventList[i]] = [];
      }
    }

    function clear(eventName, scope) {
      if(!eventName) {
        return;
      }

      if(scope) {
        var clearList = _.findWhere(eventClearFnList, {en: eventName});
        if(angular.isArray(clearList)) {
          angular.forEach(clearList, function(cf) {
            cf.fn();
          });
        } else {
          clearList.fn();
        }
      } else {
        root.$$listeners[eventName] = [];
      }
    }
  }
  
})();