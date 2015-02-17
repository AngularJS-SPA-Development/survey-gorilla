(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .config(config);

  /* @ngInject */
  function config($stateProvider) { 
    $stateProvider
      .state('group', {
        url: '/',
        templateUrl: 'app/group/group.html',
        controller: 'GroupListCtrl'
      });
  }

})(); 