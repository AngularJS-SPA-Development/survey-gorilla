(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $stateParams, modal, group, card, pubsub, logger) {
    var vm = this;
    vm.addCard = addCard;
    _init();

    function _init() {
      _groupInfo();
      _searchCards();
      _subscribe();
    }

    function _groupInfo() {
      // 그룹 및 그룹 멤버 조회 
      group
        .getGroup($stateParams.id)
        .then(function(response) {
          vm.group = response.data;
          vm.backgroundImage = {
            'background-image': 'url(' + vm.group.photo + ')',
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
          };
          vm.titleFont = {
            'color': 'yellow',
            'text-shadow': '0 0 8px #000',
            '-moz-text-shadow': '0 0 8px #000',
            '-webkit-text-shadow': '0 0 8px #000'
          };
          vm.isAdmin = group.isGroupOwner(vm.group);
          logger.info('group dashboard: ', vm.group);
        });
    }

    function _searchCards() {
      $scope.$watch(function() { 
        return vm.cardTitle; 
      }, function(newVal, oldVal) {
        _cards({title: vm.cardTitle});
      });
    }

    function _cards(params) {
      // 카드를 만들어줌 
      vm.cards = [];
      // 카드 목록 조회 
      card 
        .getCards($stateParams.id, params)
        .then(function(response) {
          vm.cards = response.data;
          logger.info('dashboard cads: ', vm.cards);
        });
    }

    function addCard() {
      modal
        .open('', 'create-card.html', 'CreateCardCtrl', vm.group)
        .then(function(result){
          logger.info('create card result: ', result);
          vm.cards.unshift(result);
        }, function(error) {});
    }

    function _subscribe() {
      pubsub.subscribe("alarm:card", function(evt, data) {
        if(data.alarm.group.id !== vm.group.id) {
          return;
        }

        if(data.alarm.type === 'CARD_PUBLISHED') {
          vm.cards.unshift(data.card);

        } else if (   data.alarm.type === 'CARD_RESPONDED'
                   || data.alarm.type === 'CARD_COMPLETED') {
          
          angular.forEach(vm.cards, function(card, idx) {
            if(card.id === data.card.id) {
              vm.cards[idx] = data.card;
              return;
            }
          });
        }
      });
    }
  }

})();
