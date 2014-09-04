'use strict';

describe('Controller: GroupCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyGorillaApp'));

  var GroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupCtrl = $controller('GroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
