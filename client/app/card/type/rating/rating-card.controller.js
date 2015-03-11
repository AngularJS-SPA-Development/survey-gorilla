(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('ratingCardTypeCtrl', ratingCardTypeCtrl);

  /* @ngInject */
  function ratingCardTypeCtrl($scope, card, pubsub, logger) {
    $scope.setRating = setRating;
    _init();

    function _init() {
      _subscribe();
      $scope.ratings = [{id:0, status:false}, {id:1, status:false}, {id:2, status:false}, {id:3, status:false}, {id:4, status:false}];

      $scope.response_card = {rating: { rating: 0 }};
    }

    function setRating(idx) {
      $scope.ratings = _.filter($scope.ratings, function(rate) {
        if(rate.id <= idx) {
          rate.status = true;
        } else {
          rate.status = false;
        }
        return rate;
      });

      $scope.response_card.rating.rating = idx+1;
    }

    function _subscribe() {
      pubsub.subscribe('response-card:' + $scope.card.id, _response, $scope);
      $scope.$on('$destroy', function() {
        pubsub.clear('response-card:' + $scope.card.id, $scope);
      });
    }

    function _response() {
      card
        .responseCard($scope.card.id, $scope.response_card)
        .then(function(response) {
          _publish(response.data);
        });
    }

    function _publish(responded_card) {
      // 응답 결과 
    }
  }

})();