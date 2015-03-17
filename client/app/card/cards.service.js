(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('card', card)
    .constant('CARD_LIMIT', {count: 5});

  /* @ngInject */
  function card(Cards, Auth, CARD_LIMIT) {
    this.getCard = getCard;
    this.getCards = getCards;
    this.create = create;
    this.remove = remove;
    this.update = update;
    this.responseCard = responseCard;

    function getCard(cardId) {
      return Cards.one(cardId).get();
    }

    function getCards(groupId, params) {
      var card = {group: groupId, type: 'ALL', complete: 'ALL', sort: '-CREATED', limit: CARD_LIMIT.count};

      if(params) {
        params = angular.extend(card, params);
      } else {
        params = card;
      }

      return Cards.customGET('', params);
    }

    function create(params) {
      return Cards.customPOST(params);
    }

    function remove(cardId) {
      return Cards.one(cardId).customDELETE();
    }

    function update(cardId, params) {
      return Cards.one(cardId).customPUT(params);
    }
    
    function responseCard(cardId, params) {
      return Cards.one(cardId).customPOST(params, 'respond');
    }
  }
})();