(function() {
  'use strict';

  angular
    .module('sg.base')
    .service('templateCache', templateCache);

  function templateCache($templateCache, $compile) {
    this.getTemplate = getTemplate;

    function getTemplate(templateId, scope) {
      var html = $templateCache.get(templateId);
      if(!html) { return; }
      return $compile(html)(scope);
    };
  }
  
})();