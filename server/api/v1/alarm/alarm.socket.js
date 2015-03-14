/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Alarm = require('./alarm.model');

exports.register = function(socket) {
  Alarm.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Alarm.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('alarm:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('alarm:remove', doc);
}