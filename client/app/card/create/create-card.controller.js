(function() {
  'use sctrict';

  angular
    .module('surveyGorillaApp')
    .controller('CreateCardCtrl', CreateCardCtrl);

  /* @ngInject */
  function CreateCardCtrl($scope, $modalInstance, card, sgAlert) {
    $scope.create = create;
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.card = {
        name: '',
        description: ''
      };
    }

    function create() {
      card
        .create($scope.card)
        .then(function(response) {
          $modalInstance.close(response.data);
        }, function(error) {
          sgAlert.error('create card error', error);
        });
    };

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }

})();