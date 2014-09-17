'use strict';

describe('Controller: GroupListCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyGorillaApp'));

  var GroupListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // GroupListCtrl = $controller('GroupListCtrl', {
    //   $scope: scope
    // });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
