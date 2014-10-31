'use strict';

var status = function(err) {
  switch (err.code) {
    case 'AUTHENTICATION_REQUIRED':
    case 'AUTHENTICATION_INVALID':
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
    case 'UNAUTHORIZED':
      return 401;
    case 'NOT_SELF':
    case 'NOT_GROUP_OWNER':
    case 'NOT_GROUP_MANAGER':
    case 'NOT_GROUP_MEMBER':
    case 'NOT_RELATED_TO_GROUP':
    case 'ALREADY_RELATED_TO_GROUP':
    case 'NOT_CARD_OWNER':
    case 'NOT_ALARM_OWNER':
    case 'FORBIDDEN':
      return 403;
    case 'USER_NOT_FOUND':
    case 'GROUP_NOT_FOUND':
    case 'PHOTO_NOT_FOUND':
    case 'CARD_NOT_FOUND':
    case 'API_NOT_FOUND':
      return 404;
    case 'USER_DUPLICATED':
    case 'USER_MISMATCH':
    case 'PASSWORD_MISMATCH':
    case 'TOKEN_MISMATCH':
    case 'NOT_FOR_GROUP_OWNER':
    case 'CARD_ALREADY_RESPONDED':
    case 'CARD_ALREADY_COMPLETED':
      return 409;
    case 'REQUIRED_FIELD':
    case 'INVALID_FIELD':
    case 'REQUIRED_PHOTO':
    case 'REQUIRED_PARAM':
    case 'INVALID_PARAM':
      return 422;
    default:
      console.error(err.stack);
      return 500;
  }
};

exports = module.exports = function errorHandler() {
  /* jshint unused: false */
  return function errorHandler(err, req, res, next) {
    res.status(status(err));

    var error = { message: err.message };
    for (var prop in err) error[prop] = err[prop];
    var json = JSON.stringify({ error: error });
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  };
};
