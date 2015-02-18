'use strict';

describe('Directive: sgSelectOnClick', function () {

  // load the directive's module
  beforeEach(module('sg.base'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sg-select-on-click></sg-select-on-click>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the sgSelectOnClick directive');
  }));
});