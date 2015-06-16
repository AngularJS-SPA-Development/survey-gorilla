(function() {
  'use strict';

  angular
    .module('sg.app')
    .directive('photoProfile', photoProfile);

  /* @ngInject */
  function photoProfile($rootScope, filer, config, logger) {
    return {
      restrict: 'EA',
      scope: {
        profile: '=info'
      },
      template: '<div>' +
                  '<img class="group_img" id="_photo" ng-src="{{profile.modelPhoto}}">' +
                  '<div ng-if="profile.isAdmin" ng-file-select ng-model="file" class="btn btn-default btn-sm" style="margin-left: 20px">Select File</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {
      scope.$watch('file', function () {
        if(!scope.file) { return; }
        _upload();
      });

      function _upload() {
        filer
          .uploadPhoto(scope.profile.modelName, scope.profile.modelId, scope.file)
          .then(function(response) {
            // change image
            var media = document.getElementById('_photo');
            var photo_url = config.api_version + '/' + scope.profile.modelName + '/' + scope.profile.modelId + '/photo';
            media.src = photo_url;  
            $rootScope.$broadcast('profile:image:change', {id: scope.profile.modelId, photo: photo_url});
          });
      }
    }
  }

})();