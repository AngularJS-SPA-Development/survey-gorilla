(function() {

  'use strict';
  angular
    .module('surveyGorillaApp')
    .directive('sgSelectOnClick', SgSelectOnClick);

  /* @ngInject */
  function SgSelectOnClick() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          this.select();
        });
      }
    };
  }

})();