(function() {
  'use strict';

  /**
   * maneul : https://github.com/danialfarid/angular-file-upload
   */
  angular
    .module('sg.base')
    .service('filer', filer);

  /* @ngInject */
  function filer($q, $upload, config, Auth, logger) {
    this.uploadPhoto = uploadPhoto;

    function uploadPhoto(model, id, file) {
      var deferred = $q.defer();

      var params = {
        url: config.api_version + '/' + model + '/' + id + '/photo',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + Auth.getToken()
        },
        fileFormDataName: 'photo',
        file: file[0]
      };

      $upload
        .upload(params)
        .progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          logger.info('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          //logger.info('file ' + config.file.name + 'uploaded. success: ' + JSON.stringify(data));
          deferred.resolve(data);
        }).error(function (data, status, headers, config) {
          //logger.info('file ' + config.file.name + 'uploaded. error: ' + JSON.stringify(data));
          deferred.reject(data);
        });

      return deferred.promise;
    }
  }

})();