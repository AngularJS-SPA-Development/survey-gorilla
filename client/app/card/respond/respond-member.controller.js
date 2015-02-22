(function() {
  'use sctrict';

  angular
    .module('surveyGorillaApp')
    .controller('ShowRespondMemberCtrl', ShowRespondMemberCtrl);

  /* @ngInject */
  function ShowRespondMemberCtrl($scope, $modalInstance, params) {
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.members = params.responses;
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }

})();