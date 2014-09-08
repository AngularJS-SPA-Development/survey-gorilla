'use strict';

describe('Factory: sgHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('surveyGorillaApp'));

  // instantiate service
  var sgHttpInterceptor;
  beforeEach(inject(function (_sgHttpInterceptor_) {
    sgHttpInterceptor = _sgHttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!sgHttpInterceptor).toBe(true);
  });

});
