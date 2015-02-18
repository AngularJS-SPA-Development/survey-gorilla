'use strict';

describe('Service: sgDate', function () {

  // load the service's module
  beforeEach(module('sg.base'));

  // instantiate service
  var sgDate;
  beforeEach(inject(function (_sgDate_) {
    sgDate = _sgDate_;
  }));

  it('should do current date', function () {
    expect(sgDate.currentDate()).toBe('2014/09/17');
  });

  it('should do this year', function () {
    expect(sgDate.thisYear()).toBe('2014');
  });

  it('should do this month', function () {
    expect(sgDate.thisMonth()).toBe('09');
  });

});
