'use strict';

describe('Service: sgAlert', function () {

  // load the service's module
  beforeEach(module('sg.app'));

  // instantiate service
  var sgAlert;
  beforeEach(inject(function (_sgAlert_) {
    sgAlert = _sgAlert_;
  }));

  it('should do something', function () {
    expect(!!sgAlert).toBe(true);
  });

});
