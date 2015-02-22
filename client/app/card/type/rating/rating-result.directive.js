(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('ratingsResult', ratingsResult);

  function ratingsResult() {
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
      if(!scope.card.responses || scope.card.responses.length <= 0) { return; }

      // 개별적인 응답값을 계산 
      var total = 0;
      angular.forEach(scope.card.responses, function(respond) {
        total += respond.rating.rating;
      });
      scope.rating = total/scope.card.responses.length;
    }
  }

})();