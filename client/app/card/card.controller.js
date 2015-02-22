(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('cardCtrl', cardCtrl);

  /* @ngInject */
  function cardCtrl($scope, pubsub, logger) {
    $scope.respondCard = respondCard;
    $scope.respondMember = respondMember;
    var vm = this;
    _init();

    function _init() {
      _subscribe();
      _setShow();
    }

    function _setShow(card) {
      if(card) {
        $scope.card = card;
      }
      vm.templateId = getTemplateId($scope.card);
    }

    function getTemplateId(card) {
      var templateId = '';
      if(card.type === 'NOTICE') {
        if(card.responded) {
          templateId = 'notice-card.html';
        } else {
          templateId = 'notice-card.html';
        }
      } else if(card.type === 'RATING') {
        if(card.responded) {
          templateId = 'rating-card-result.html';
        } else {
          templateId = 'rating-card.html';
        }
      } else if(card.type === 'OBJECTIVE') {
        if(card.responded) {
          templateId = 'objective-card-result.html';
        } else {
          templateId = 'objective-card.html';
        }
      }  
      return templateId;
    }

    function respondCard() {
      pubsub.publish('response-card:' + $scope.card.id);
    }

    function respondMember() {

    }

    function _subscribe() {
      pubsub.subscribe('response-card-result:' + $scope.card.id, _respondedCard);
    }

    function _respondedCard(event, responded_card) {
      logger.info('response result: ', responded_card);
      _setShow(responded_card);
    }
  }

})();