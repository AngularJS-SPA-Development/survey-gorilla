(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('ratingsResult', ratingsResult);

  function ratingsResult(cardCondition) {
    return {
      restrict: 'EA',
      template: '<div class="rating" ng-cloak>' +
                  '<div ng-repeat="rate in ratings">' +
                    '<img ng-src="{{rating > $index ? \'/images/rating_active.png\' : \'/images/rating.png\'}}">' +
                  '</div>' + 
                  '<span class="scale-fade">{{rating | number:1}}</span>' + 
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {
    }
  }

})();