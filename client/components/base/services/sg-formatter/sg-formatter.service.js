(function() {

  'use strict';
  angular
    .module('sg.base')
    .service('sgFormatter', SgFormatter);

  /* @ngInject */
  function SgFormatter() {
    this.percentFormat = function(value) {
      if(value && !isNaN(value)) {
        return numeral(value).format('0,0.[0]');
      } else {
        return '0';
      }
    };

    this.integerFormat = function(value) {
      if(value && !isNaN(value)) {
        return numeral(value).format('0');
      } else {
        return '0';
      }
    };

    this.numberFormat = function(value, format) {
      if(value && !isNaN(value)) {
        return numeral(value).format(format);
      } else {
        return '0';
      }
    };
  }

})();