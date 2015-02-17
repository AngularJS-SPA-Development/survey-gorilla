(function() {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('group', Group);

  /* @ngInject */
  function Group() {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.text('this is the group directive');
      }
    };
  }

})();