'use strict';

var _ = require('lodash'),
    code = require('./error_code');

Error.new = function(e) {
  var err = new Error();
  _.extend(err, e);
  return err;
};