'use strict';

describe('Service: storage', function () {

  beforeEach(module('sg.base'));

  var storage;
  beforeEach(inject(function (_storage_) {
    storage = _storage_;
  }));

  it('should do setValue & getValue', function () {
    storage.setValue('user-token', 'abcdefg123');
    expect(storage.getValue('user-token')).toEqual('abcdefg123');
    storage.flush();
  });

  it('should do removeValue', function () {
    storage.setValue('user-token', 'abcdefg123');
    expect(storage.getValue('user-token')).toEqual('abcdefg123');
    storage.removeValue('user-token');
    expect(storage.getValue('user-token')).toBe(null);
  });

  it('should do setTTL', function (done) {
    storage.setValue('user-token', 'abcdefg123');
    expect(storage.getValue('user-token')).toEqual('abcdefg123');
    storage.setTTL('user-token', 1000);

    expect(storage.getValue('user-token')).toBe('abcdefg123');
    setTimeout(function() {
      expect(storage.getValue('user-token')).toBe(null);
      done();
    }, 2000);

  });

});
