'use strict';

describe('Service: groupManager', function () {

  // load the service's module
  beforeEach(module('surveyGorillaApp'));

  // instantiate service
  var groupManager;
  beforeEach(inject(function (_groupManager_) {
    groupManager = _groupManager_;
  }));

  it('should do something', function () {
    expect(!!groupManager).toBe(true);
  });

});
