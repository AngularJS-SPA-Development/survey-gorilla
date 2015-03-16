(function() {
  'use strict';

  angular
    .module('sg.app')
    .factory('socket', socket);

  /* @ngInject */
  function socket(socketFactory, Auth) {
    // var socket = io.connect('', {
    //   'reconnection delay': 3000,
    //   'reconnection limit': 3000,
    //   'max reconnection attempts': 'Infinity'
    // });
    
    var socket = io.connect();

    var socketFactory = socketFactory({
      ioSocket: socket,
      prefix: ''
    });

    return {
      socket: socketFactory,
      createSocketSession: function () {
        socket.emit('login', Auth.getToken());
      },
      disconnectSocketSession: function () {
        socket.emit('logout');
      },
      syncUpdates: function (eventName, cb) {
        cb = cb || angular.noop;
        socketFactory.on(eventName, function (item) {
          cb(eventName, item);
        });
      },
      unsyncUpdates: function (eventName) {
        socketFactory.removeAllListeners(eventName);
      }
    };
  }

})();