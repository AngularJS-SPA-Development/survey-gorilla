/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Card = require('./card.model');

exports.register = function(socket) {
  Card.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Card.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('card:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('card:remove', doc);
}