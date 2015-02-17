(function() {

  'use strict';

  angular
    .module('socketMock', [])
    .factory('socket', socket);

  function socket() {
    return {
      socket: {
        connect: function() {},
        on: function() {},
        emit: function() {},
        receive: function() {}
      },

      syncUpdates: function() {},
      unsyncUpdates: function() {}
    };
  }

})();