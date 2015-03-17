(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $stateParams, modal, group, card, pubsub, CARD_LIMIT, logger) {
    var vm = this;
    vm.addCard = addCard;
    vm.cards = [];
    vm.addMoreCards = addMoreCards;
    var lastCardDate;
    var isLoadMore = true;
    _init();

    function _init() {
      _groupInfo();
      //_searchCards();
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

    function addMoreCards() {
      if(!isLoadMore) { return; }

      _cards({lt: lastCardDate});
    }

    function _cards(params) {
      // 카드 목록 조회 
      card 
        .getCards($stateParams.id, params)
        .then(function(response) {
          if(!_isLoadMore(response.data)) { return; }

          //vm.cards.unshift(response.data);
          angular.forEach(response.data, function(data) {
            // check duplicate card
            if(_.findWhere(vm.cards, {id : data.id})) { return; }

            vm.cards.push(data);
          });

          logger.info('dashboard cads: ', vm.cards);

          lastCardDate = vm.cards[vm.cards.length-1].created_at;
        });
    }

    function _isLoadMore(data) {
      if(!data || data.length <= 0) { 
        isLoadMore = false; 
      } else {
        if(data.length >= CARD_LIMIT.count) {
          isLoadMore = true;
        } else {
          isLoadMore = false;
        }
      }
      return isLoadMore;
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
