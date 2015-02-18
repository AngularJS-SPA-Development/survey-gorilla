(function() {
  'use sctrict';

  angular
    .module('surveyGorillaApp')
    .controller('ReadGroupCtrl', ReadGroupCtrl);

  /* @ngInject */
  function ReadGroupCtrl($scope, $modalInstance, params, group, sgAlert, logger) {
    $scope.join = join;
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.group = params.group;
      $scope.isAdmin = group.isGroupOwner(params.group);
    }

    function join() {

    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  }

})();