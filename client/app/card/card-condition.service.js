(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .service('cardCondition', cardCondition);

  /* @ngInject */
  function cardCondition(Cards, sgFormatter) {
    this.responseCard = responseCard;
    this.calcResult = calcResult;

    function responseCard(cardId, params) {
      return Cards.one(cardId).customPOST(params, 'respond');
    }

    function calcResult(card) {
      if(card.type === 'RATING') {
        return _rating(card);
      } else if(card.type === 'SURVEY' && card.survey.type ==='MULTIPLE_OBJECTIVE' 
        || card.type === 'SURVEY' && card.survey.type ==='SINGLE_OBJECTIVE') {
        return _objective(card);
      }
    }

    function _rating(card) {
      if(!card.responses || card.responses.length <= 0) { return; }

      // 개별적인 응답값을 계산 
      var total = 0;
      angular.forEach(card.responses, function(respond) {
        total += respond.rating.rating;
      });
      return total/card.responses.length;
    }

    function _objective(card) {
      if(card.group.member_count === 0) { return; }
      if(card.survey.type === 'SINGLE_OBJECTIVE') {
        return _single(card);
      } else {
        return _multiple(card);
      }
    }

    function _single(card) {
      var results = [];
      angular.forEach(card.survey.options, function(option) {
        results.push({ 'option': option, 'count': 0, 'rate': 0, 'type': 'danger' });
      });

      angular.forEach(card.responses, function(response) {
        if(!response.survey || !response.survey.answer) { return; }
        var option = card.survey.options[response.survey.answer];
        var result = _.find(results, { 'option': option });
        result.count++;
      });

      var total = card.responses.length;
      angular.forEach(results, function(result) {
        if(result.count) {
          result.type = _type((result.count/total) * 100);
          result.rate = sgFormatter.percentFormat((result.count/total) * 100);
        }  
      });
      return results;
    }

    function _multiple(card) {
      var results = [];
      angular.forEach(card.survey.options, function(option) {
        results.push({ 'option': option, 'count': 0, 'rate': 0, 'type': 'danger' });
      });

      var total = 0;
      angular.forEach(card.responses, function(response) {
        // multiple checked
        angular.forEach(response.survey.answer, function(checkedIdx) {
          var option = card.survey.options[checkedIdx];
          var result = _.find(results, { 'option': option });
          result.count++;
          total++;
        });
      });

      angular.forEach(results, function(result) {
        if(result.count) {
          result.type = _type((result.count/total) * 100);
          result.rate = sgFormatter.percentFormat((result.count/total) * 100);
        }  
      });

      return results;
    }

    function _type(value) {
      var type = 'danger';
      if (value < 25) {
        type = 'danger';
      } else if (value < 50) {
        type = 'warning';
      } else if (value < 75) {
        type = 'info';
      } else {
        type = 'success';
      }
      return type;
    }
  }

})();