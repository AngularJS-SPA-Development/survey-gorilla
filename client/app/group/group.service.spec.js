'use strict';

describe('Service: group', function () {

  // load the service's module
  beforeEach(module('surveyGorillaApp'));

  // instantiate service
  var group;
  beforeEach(inject(function (_groupSvc_) {
    group = _groupSvc_;
  }));

  it('should do something', function () {
    expect(!!group).toBe(true);
  });

});
