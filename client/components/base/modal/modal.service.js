(function() {
  'use strict';

  angular
    .module('sg.base')
    .service('modal', modal);

  /* @ngInject */
  function modal($modal, $q) {
    this.open = open;

    /**
     * size : '', 'lg', 'sm'
     */
    function open(size, templateId, controller, params) {
      var modalInstance = $modal.open({
        templateUrl: templateId, //'myModalContent.html',
        controller: controller, //'ModalInstanceCtrl',
        size: size,
        resolve: {
          params: function () {
            return params;
          }
        }
      });

      var deferred = $q.defer();
      modalInstance.result.then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }
  }

})();