(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('noticeCardTypeCtrl', noticeCardTypeCtrl);

  /* @ngInject */
  function noticeCardTypeCtrl($scope, modal, cardCondition, pubsub, logger) {
    _init();

    function _init() {
      _subscribe();
    }

    function _subscribe() {
      pubsub.subscribe('response-card:' + $scope.card.id, _response, $scope);
      $scope.$on('$destroy', function() {
        pubsub.clear('response-card:' + $scope.card.id, $scope);
      });
    }

    /**
     * Send response card
     */
    function _response() {
      cardCondition
        .responseCard($scope.card.id, {})
        .then(function(response) {
          _publish(response.data);
        });
    }

    function _publish(responded_card) {
      pubsub.publish('response-card-result:' + $scope.card.id, responded_card);
    }
  }

})();