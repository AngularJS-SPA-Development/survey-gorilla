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
      // photo-profile directive 에서 사용함 
      $scope.profile = {
        modelName: 'groups',
        modelId: params.group.id,
        modelPhoto: params.group.photo,
        isAdmin: group.isGroupOwner(params.group)
      }

      // photo-profile directive 로 옮김 
      // 
      // $scope.$watch('file', function () {
      //   if(!$scope.file) { return; }
      //   _upload();
      // });
    }

    // photo-profile directive 로 옮김 
    //
    // function _upload() {
    //   filer
    //     .uploadPhoto('groups', $scope.group.id, $scope.file)
    //     .then(function(response) {
    //       // change image
    //       var media = document.getElementById('_photo');
    //       media.src = '/api/v1/groups/' + $scope.group.id + '/photo';  
    //     }, function(error) {
    //       logger.info('file uploading error: ', error);
    //     });
    // }

    function join() {

    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

})();