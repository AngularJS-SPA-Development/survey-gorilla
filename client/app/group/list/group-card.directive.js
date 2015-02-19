(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('groupCard', groupCard);

  /* @ngInject */
  function groupCard() {
    return {
      restrict: 'EA',
      scope: {
        group: '=info',
        showDetail: '&'
      },
      template: '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
                  '<div class="panel panel-default">' + 
                    '<div class="panel-heading">' +
                      '<h3 class="panel-title"><i class="fa fa-users"></i> <a ng-href="#/dashboard/{{group.id}}">{{group.name}}</a></h3>' +
                    '</div>' +
                    '<div class="panel-body" ng-style="backgroundImage">' +
                      '<p class="group_card_desc" ng-style="descriptionFont">{{group.description}}</p> ' +
                      '<a href="#" ng-click="showDetail({group: group})" class="btn btn-default btn-xs pull-right" role="button">More Info</a>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {
      scope.$on('profile:image:change', function(evt, data) {
        if(data.id === scope.group.id) {
          scope.backgroundImage = {
            'background-image': 'url(' + data.photo + ')',
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
          };
        }
      });

      scope.backgroundImage = {
        'background-image': 'url(' + scope.group.photo + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover'
      };

      scope.descriptionFont = {
        'color': 'yellow',
        'text-shadow': '0 0 8px #000',
        '-moz-text-shadow': '0 0 8px #000',
        '-webkit-text-shadow': '0 0 8px #000'
      };
    }
  }

})();