(function() {
  'use strict';

  angular
    .module('sg.base')
    .directive('sgEnter', SgEnter);

  /* @ngInject */
  function SgEnter() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
              scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  }

})();