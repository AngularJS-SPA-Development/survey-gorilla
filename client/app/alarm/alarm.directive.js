(function() {
  'use strict';

  angular
    .module('surveyGorillaApp')
    .directive('sgAlarm', sgAlarm);

  /* @ngInject */
  function sgAlarm() {
    return {
      restrict: 'EA',
      scope: {
        alarm: '=info',
        readAlarm: '&'
      }, 
      template: '' +
        '<div style="width: 300px">' +
          '<li ng-click="readAlarm({alarmId: alarm.id})" style="padding-left: 10px; padding-top: 5px"> ' +
            '<i class="fa fa-check-square-o"></i>' +
            '<a ng-href="#/dashboard/{{alarm.group.id}}">{{alarm.group.name}}</a> ' +
            '<br>{{alarm.msg}} <span class="pull-right" style="color:gray; padding-right:10px;">{{alarm.created_at}} </span>' +
          '</li>' +
          '<li class="divider" ng-hide="navbar.alarms.length-1 === $index"></li>' +
        '</div>'
    }
  }

})();