(function() {
  'use strict';
  
  angular
    .module('sg.base')
    .service('sgDate', SgDate);

  /* @ngInject */
  function SgDate() {
    this.currentDateTime = function() {
      return moment().format('YYYY/MM/DD HH:mm:ss');
    };

    this.currentDate = function() {
      return moment().format('YYYY/MM/DD');
    };

    this.thisYear = function() {
      return moment().format('YYYY');
    };

    this.thisMonth = function() {
      return moment().format('MM');
    };
  }

})();