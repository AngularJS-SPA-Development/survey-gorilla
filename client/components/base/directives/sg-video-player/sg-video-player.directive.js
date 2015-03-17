(function() {
  'use strict';

  /**
   * <video-player source="youtube" url="http://youtu.be/VEUfscdqpNg"></video-player>
     <video-player source="vimeo" url="http://vimeo.com/101266603"></video-player>
     <video-player source="vine" url="https://vine.co/v/bnB77Z9QMZh"></video-player>
   */
  angular
    .module('sg.base')
    .directive('videoPlayer', ['$sce', videoPlayer]);

  function videoPlayer($sce) {
    return {
      restrict: 'E',
      scope: {
        source: '@',
        url: '@',
        playerWidth: '@',
        playerHeight: '@'
      },
      replace: true,
      template: '<iframe width="{{width}}" height="{{height}}" ng-src="{{iframeSrc}}" frameborder="0" allowfullscreen></iframe>',
      link: _link
    };

    function _link($scope, $element, $attrs) {
      var v = '';
      $scope.width  = $scope.playerWidth  || 420;
      $scope.height = $scope.playerHeight || 280;

      var config = {
        'youtube': {
          search: [
              /youtu\.be\/(.+)/,
              /youtube\.com\/watch\?v=(.+)/
          ],
          embed: 'http://www.youtube.com/embed/@',
          index: 1
        },
        'vimeo': {
          search: [
              /vimeo\.com\/(.+)/,
              /vimeo.com\/channels\/staffpicks\/(.+)/
          ],
          embed: 'http://player.vimeo.com/video/@',
          index: 1
        },
        'vine': {
          search: [
              /vine\.co\/v\/(.+)/
          ],
          embed: 'http://vine.co/v/@/embed/simple',
          index: 1
        }
      };

      var tokens = config[$attrs.source];

      Object(tokens.search).forEach(function(t) {
        var domain = $attrs.url.substr($attrs.url.indexOf('://')+3),
            match  = domain.match(t);

        if (match) v = match[tokens.index];
      });

      $scope.iframeSrc = $sce.trustAsResourceUrl(tokens.embed.replace('@', v));
    }
  }

})();