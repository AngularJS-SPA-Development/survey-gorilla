(function () {

  'use strict';

  angular
    .module('surveyGorillaApp')
    .config(Config);

  /* @ngInject */
  function Config($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard/:id',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      });
  }
  
})();