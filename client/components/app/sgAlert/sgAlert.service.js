(function() {

  'use strict';
  angular
    .module('sg.app')
    .service('sgAlert', sgAlert);

  /* @ngInject */
  function sgAlert(gettextCatalog, $timeout) {
    this.success = function(msg) {
      alerting('success', msg);
    };

    this.information = function(msg) {
      alerting('information', msg);
    };

    this.warning = function(msg) {
      alerting('warning', msg);
    };

    this.error = function(msg, err) {
      alerting('error', msg, err);
    };

    function alerting(type, msg, err) {
      msg = gettextCatalog.getString(msg);

      var nt = noty({
          text: msg
        , type: type
        , layout: 'top'
      });

      if(nt) {
        $timeout(function() {
          nt.close();
        }, 5000);
      }

      if(err) {
        if(bowser.chrome) {  // for DevTool in Chrome
          console.table([{'message': msg, 'error': err}]);
        } else {
          console.log({'message': msg, 'error': err});
        }  
      }
    }
  }

})();