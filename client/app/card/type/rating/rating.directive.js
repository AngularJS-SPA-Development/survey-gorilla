(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('ratings', ratings);

  function ratings() {
    return {
      restrict: 'EA',
      template: '<div class="rating" ng-cloak>' +
                  '<div class="slide-left"  ng-repeat="rate in ratings">' +
                    '<img ng-src="{{rate.status ? \'/images/rating_active.png\' : \'/images/rating.png\'}}" ng-click="setRating($index)">' + 
                  '</div>' +
                  '<span>{{response_card.rating.rating | number:0}}</span>' + 
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {}
  }

})();