(function() {
  'user strict';

  angular
    .module('sg.base')
    .service('textParser', textParser);

  function textParser($compile) {
    this.parsing = parsing;
    var url, scope, element;
      
    function parsing(text, s, e) {
      url = null;
      scope = s;
      element = e;
      return _innerParse(text);
    }
      
    function _innerParse(text, target) {
      if (!text) return text;
      var LINKY_URL_REGEXP = /((http|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/; 
      var match, i;
      var raw = text;
      while ((match = raw.match(LINKY_URL_REGEXP))) {
        // We can not end in these as they are sometimes found at the end of the sentence
        url = match[0];
        i = match.index;
        _addText(raw.substr(0, i));
        _addLink(url, match[0].replace(LINKY_URL_REGEXP, url));
        raw = raw.substring(i + match[0].length);
      }
      _addText(raw);
    }

    function _addText(text) {
      if (!text) {
        return;
      }
      element.append('<pre>' + text + '</pre>');
    }

    function _addLink(url, text) {
      // youtube url
      var YOUTUBE_REGEXP = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
      var VIMEO_REGEXP = /vimeo.com\/(\d+)/;
      var VINE_REGEXP = /vine.co\/(\d+)/;
      if(YOUTUBE_REGEXP.test(url)) {
        var el = angular.element('<video-player source="youtube" url="{{URL}}"></video-player>');
        var newScope = scope.$new();
        newScope.URL = url;
        $compile(el)(newScope);
        element.append(el);
      } 
      // vimeo url
      else if(VIMEO_REGEXP.test(url)) {
        var el = angular.element('<video-player source="vimeo" url="{{URL}}"></video-player>');
        var newScope = scope.$new();
        newScope.URL = url;
        $compile(el)(newScope);
        element.append(el);
      } 
      // vine url 
      else if(VINE_REGEXP.test(url)) {
        var el = angular.element('<video-player source="vine" url="{{URL}}"></video-player>');
        var newScope = scope.$new();
        newScope.URL = url;
        $compile(el)(newScope);
        element.append(el);
      }
      // common link url 
      else {
        var el = angular.element('<a href="#" ng-click="openWindow(\'' + url + '\')">' + text + '</a>');
        $compile(el)(scope);
        element.append(el);
      }
    }
  }

})();