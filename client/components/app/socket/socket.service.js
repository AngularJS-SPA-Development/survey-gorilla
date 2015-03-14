(function() {
  'use strict';

  angular
    .module('sg.app')
    .factory('socket', socket);

  /* @ngInject */
  function socket(socketFactory, Auth) {
    var retryInterval = 30000;
    var retryTimer;
    clearInterval(retryTimer);

    var socket = io.connect('', {
      'force new connection': true,
      'max reconnection attempts': Infinity,
      'reconnection limit': 10 * 1000
      // Send auth token on connection
      // 'query': 'token=' + Auth.getToken()
    });

    retryTimer = setInterval(function () {
      if (socket &&
          socket.disconnected &&
          !socket.connected) {
        socket.connect();
      }
    }, retryInterval);

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