(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('cardCondition', cardCondition);

  /* @ngInject */
  function cardCondition(Cards, Auth) {
    this.responseCard = responseCard;

    function responseCard(cardId, params) {
      return Cards.one(cardId).customPOST(params, 'respond');
    }
  }

})();