(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('card', card)
    .directive('cardType', cardType);

  /* @ngInject */
  function card() {
    return {
      restrict: 'EA',
      controller: 'cardCtrl',
      scope: {
        card: '=info'
      },
      transclude: true,
      template: '<div class="panel panel-default bootcards-summary" style="margin-left:15px; margin-right:15px;">' +
                  '<div class="panel-heading">' +
                    '<h3 class="panel-title">{{::card.title}}</h3>' +
                  '</div>' +
                  '<div class="panel-body">' +
                    '<div class="row">' +
                      '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">{{::card.description}}</div>' +
                      '<div ng-transclude></div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="panel-footer">' +
                    '<small class="pull-right">' + 
                      '<div ng-if="card.responded" ng-click="respondMember()" class="btn btn-sm btn-default"><i class="fa fa-users"></i> Response {{card.responses.length}}</div>' +
                      '<div ng-if="!card.responded" ng-click="respondCard()" class="btn btn-sm btn-default"><i class="fa fa-check"></i> Send</div>' +
                    '</small>' +
                  '</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {

    }
  }

  /* @ngInject */
  function cardType(templateCache, $timeout) {
    return {
      restrict: 'EA',
      require: '^card',
      scope: {
        card: '=info'
      },
      template: '<div></div>',
      link: link
    };

    function link(scope, element, attrs, cardCtrl) {
      scope.$watch(function() { return cardCtrl.templateId; }, function(templateId) {
        if(!templateId) { return; } 
        // 템플릿에 따라 카드의 종류가 틀려진다. 
        $timeout(function() {
          element.html(templateCache.getTemplate(templateId, scope));
        });
      });
    }
  }

})();