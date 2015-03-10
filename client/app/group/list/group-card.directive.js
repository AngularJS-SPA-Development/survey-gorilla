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
        group: '=info'
      },
      template: '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
                  '<div class="panel panel-default">' + 
                    '<div class="panel-heading">' +
                      '<h3 class="panel-title"><i class="fa fa-users"></i> {{group.name}}</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="group_card_desc" ng-style="descriptionFont">{{group.description}}</p> ' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {
      scope.descriptionFont = {
        'color': 'yellow',
        'text-shadow': '0 0 8px #000',
        '-moz-text-shadow': '0 0 8px #000',
        '-webkit-text-shadow': '0 0 8px #000'
      };
    }
  }

})();