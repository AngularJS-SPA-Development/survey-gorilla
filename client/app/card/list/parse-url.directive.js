(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .controller('parseUrlCtrl', parseUrlCtrl)
    .directive('parseUrl', parseUrl);

  function parseUrlCtrl($scope, logger) {
    $scope.openWindow = openWindow;

    function openWindow(url) {
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };

      window.open(url, '_blank', options);
    }
  }

  function parseUrl($compile, textParser) {
    var compile = function() {
      return {
        pre: function(scope, element, attrs) {
          textParser.parsing(scope.card.description, scope, element);
        },
        post: function(scope, element, attrs) {
        }
      };
    }

    return {
      restrict: 'EA',
      controller: 'parseUrlCtrl',
      scope: {
        card: '=info'
      },
      template: '<div></div>',
      replace: true,
      compile: compile
    }
  }

})();