(function() {
  'use sctrict';

  angular
    .module('surveyGorillaApp')
    .controller('CreateGroupCtrl', CreateGroupCtrl);

  /* @ngInject */
  function CreateGroupCtrl($scope, $modalInstance, group, sgAlert) {
    $scope.create = create;
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.group = {
        name: '',
        description: ''
      };
    }

    function create() {
      group
        .create($scope.group)
        .then(function(response) {
          $modalInstance.close(response.data);
        }, function(error) {
          sgAlert.error('create group error', error);
        });
    };

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }

})();