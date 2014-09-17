'use strict';

describe('Service: storageService', function () {

  beforeEach(module('surveyGorillaApp'));

  var storageService;
  beforeEach(inject(function (_storageService_) {
    storageService = _storageService_;
  }));

  it('should do setValue & getValue', function () {
    storageService.setValue('user-token', 'abcdefg123');
    expect(storageService.getValue('user-token')).toEqual('abcdefg123');
    storageService.flush();
  });

  it('should do removeValue', function () {
    storageService.setValue('user-token', 'abcdefg123');
    expect(storageService.getValue('user-token')).toEqual('abcdefg123');
    storageService.removeValue('user-token');
    expect(storageService.getValue('user-token')).toBe(null);
  });

  it('should do setTTL', function (done) {
    storageService.setValue('user-token', 'abcdefg123');
    expect(storageService.getValue('user-token')).toEqual('abcdefg123');
    storageService.setTTL('user-token', 1000);

    expect(storageService.getValue('user-token')).toBe('abcdefg123');
    setTimeout(function() {
      expect(storageService.getValue('user-token')).toBe(null);
      done();
    }, 2000);

  });

});
