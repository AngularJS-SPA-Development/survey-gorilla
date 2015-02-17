'use strict';

describe('Directive: group', function () {

  // load the directive's module
  beforeEach(module('surveyGorillaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<group></group>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the group directive');
  }));
});