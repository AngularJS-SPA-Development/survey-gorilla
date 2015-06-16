(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('objectiveCardTypeCtrl', objectiveCardTypeCtrl);

  /* @ngInject */
  function objectiveCardTypeCtrl($scope, modal, card, cardCondition, pubsub, logger) {
    _init();

    function _init() {
      _subscribe();

      if($scope.card.responded) {
        $scope.results = cardCondition.calcResult($scope.card);
      } else {
        $scope.results = [];
        angular.forEach($scope.card.survey.options, function(option) {
          $scope.results.push( { 'option': option, 'checked': false });
        });
      }
    }

    function _subscribe() {
      pubsub.subscribe('response-card:' + $scope.card.id, _response, $scope);
      $scope.$on('$destroy', function() {
        pubsub.clear('response-card:' + $scope.card.id, $scope);
      });
    }

    //----------------------------------------
    //
    // Send response card
    //
    //----------------------------------------
    function _response() {
      var response_card = {
        survey : {
          answer: _prepareValue()
        }
      };

      cardCondition
        .responseCard($scope.card.id, response_card)
        .then(function(response) {
          _publish(response.data);
        });
    }

    function _prepareValue() {
      if($scope.card.survey.type === 'MULTIPLE_OBJECTIVE') {
        var checked = [];
        angular.forEach($scope.results, function(result, idx) {
          if(result.checked) {
            checked.push(idx);
          }
        });
        return checked;
      } else {
        return $scope.card.answer;
      }
    }

    function _publish(responded_card) {
      pubsub.publish('response-card-result:' + $scope.card.id, responded_card);
    }
  }

})();