(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('groupMember', groupMember);

  /* @ngInject */
  function groupMember() {
    return {
      restrict: 'EA',
      scope: {
        member: '=info'
      },
      template: '<a href="#" class="list-group-item">' +
                  '<img ng-src="{{::member.photo}}" class="img-rounded pull-left">' +
                  '<h4 class="list-group-item-heading"> {{::member.name}}</h4>' +
                  '<p class="list-group-item-text"> {{::member.email}} {{::role}}</p>' +
                '</a>',
      link: link
    };

    function link(scope, element, attrs) {
      if(scope.member.role) {
        scope.role = '(' + scope.member.role + ')';
      } else {
        scope.role = '';
      }
    }
  }

})();