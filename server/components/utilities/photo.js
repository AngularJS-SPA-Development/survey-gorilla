'use strict';

var Q = require('q'),
    fs = require('fs'),
    easyimage = require('easyimage');

var readFileAsBase64AndUnlink = function(file) {
  var deferred = Q.defer();

  fs.readFile(file, 'base64', function(err, data) {
    fs.unlink(file);

    if (err) return deferred.reject(err);
    else return deferred.resolve(data);
  });

  return deferred.promise;
};

var readImage = function(file, maxWidth) {
  return easyimage.convert({
      src: file,
      dst: file
    })
    .then(function(image) {
      if (maxWidth && image.width > maxWidth) {
        return easyimage.resize({
          src: file,
          dst: file,
          width: maxWidth,
          height: image.height
        });
      } else {
        return image;
      }
    })
    .then(function() {
      return readFileAsBase64AndUnlink(file);
    });
};

exports.read = readImage;
