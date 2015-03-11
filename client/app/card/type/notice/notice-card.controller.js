(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('noticeCardTypeCtrl', noticeCardTypeCtrl);

  /* @ngInject */
  function noticeCardTypeCtrl($scope, modal, card, pubsub, logger) {
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

    function _response() {
      card
        .responseCard($scope.card.id, {})
        .then(function(response) {
          _publish(response.data);
        });
    }

    function _publish(responded_card) {
      // 응답 결과 
    }
  }

})();