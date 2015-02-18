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
      template: '<div class="col-sm-4 col-md-3">' +
                  '<div class="panel panel-default">' + 
                    '<div class="panel-heading">' +
                      '<h3 class="panel-title"><i class="fa fa-users"></i> {{group.name}}</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="group_card_desc">{{group.description}}</p> ' +
                      '<a href="#" ng-click="showDetail({group: group})" class="btn btn-default btn-xs pull-right" role="button">More Info</a>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {}
  }

})();