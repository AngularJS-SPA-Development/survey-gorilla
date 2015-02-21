(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('card', card);

  /* @ngInject */
  function card() {
    return {
      restrict: 'EA',
      scope: {
        card: '=info'
      },
      template: '<div class="panel panel-default bootcards-summary" style="margin-left:15px; margin-right:15px;">' +
                  '<div class="panel-heading">' +
                    '<h3 class="panel-title">{{::card.title}}</h3>' +
                  '</div>' +
                  '<div class="panel-body">' +
                    '<div class="row">' +
                      '<div class="col-xs-11 col-sm-11">{{::card.description}}</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="panel-footer">' +
                    '<small class="pull-left">Summary Card Footer</small>' +
                  '</div>' +
                '</div>',
      link: link
    };

    function link(scope, element, attrs) {

    }
  }

})();