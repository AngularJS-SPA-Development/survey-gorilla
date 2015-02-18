(function() {
  'use strict';

  angular
    .module('sg.base')
    .service('filer', filer);

  /* @ngInject */
  function filer($q, $upload) {
    this.upload = upload;

    function upload(upload_url, params, file, logger) {
      var deferred = $q.defer();

      $upload
        .upload({
          url: upload_url,
          fields: params,
          file: file
        })
        .progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          logger.info('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          logger.info('file ' + config.file.name + 'uploaded. success: ' + JSON.stringify(data));
          deferred.resolve(data);
        }).error(function (data, status, headers, config) {
          logger.info('file ' + config.file.name + 'uploaded. error: ' + JSON.stringify(data));
          deferred.reject(data);
        });

      return deferred.promise;
    }
  }

})();