'use strict';

describe('Service: sgFormatter', function () {

  // load the service's module
  beforeEach(module('sg.base'));

  // instantiate service
  var sgFormatter;
  beforeEach(inject(function (_sgFormatter_) {
    sgFormatter = _sgFormatter_;
  }));

  it('should do .0', function () {
    expect(sgFormatter.percentFormat(90.50)).toBe('90.5');
  });

  it('should do integer', function () {
    expect(sgFormatter.integerFormat(90.50)).toBe('91');
  });

  it('should do format', function () {
    expect(sgFormatter.numberFormat(90.50, '0')).toBe('91');
  });

});
