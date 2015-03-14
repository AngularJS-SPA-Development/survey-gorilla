'use strict';

var jwt = require('jsonwebtoken'),
    config = localrequire.config(),
    authentication = localrequire.middleware('authentication');

// FOR TEST
// var verify = function(user, callback) {
//   callback({ id: user, email: user });
// };

var io;

module.exports = exports = function(app) {
  var server = require('http').Server(app);
  io = require('socket.io')(server);

  if (process.env.NODE_ENV === 'production') {
    // Enables passing events between nodes.
    // Using socket.io-adapter specifically, socket.io-redis.
    var redis = require('socket.io-redis');
    io.adapter(redis({ host: config.redis.ip, port: config.redis.port }));
  }

  io.on('connection', function(socket) {
    var user;

    var login = function(login) {
      user = login;

      socket.join(user.id);
      console.log('A socket(' + socket.id + ') has joined to:', user.id);

      // FOR TEST
      // io.to(user.id).emit('alarm', { type: 'A', test: 'alarm for ' + user.email + ' from ' + socket.id });
    };

    var logout = function() {
      if (user) {
        socket.leave(user.id);
        console.log('A socket(' + socket.id + ') has left from:', user.id);
        user = undefined;
      }
    };

    socket.on('login', function(token) {
      console.log('socket.io user token : ', token);

      if (token) {
        authentication.verify(token, login);
      }
    });

    socket.on('logout', logout);

    socket.on('disconnect', logout);
  });

  //console.log('io.js is io object : ', io);
  return server;
};

exports.send = function(user, type, data) {
  console.log('socket.io user : ', user);
  console.log('socket.io type : ', type);
  console.log('socket.io data : ', data);
  io.to(user).emit(type, data);
};
