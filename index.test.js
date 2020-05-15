'use strict';

var UrlPathToLocalPath = require('./');
var path = require('path');

var getLocalPath = UrlPathToLocalPath({
  context: './test/'
});

test('/', function () {
  return getLocalPath('/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/index.html'));
  });
});

test('/index.html', function () {
  return getLocalPath('/index.html').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/index.html'));
  });
});

test('/foo', function () {
  return getLocalPath('/foo').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/foo.html'));
  });
});

test('/foo/', function () {
  return getLocalPath('/foo/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/foo.html'));
  });
});

test('/bar', function () {
  return getLocalPath('/bar').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/bar/index.html'));
  });
});

test('/bar/', function () {
  return getLocalPath('/bar/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/bar/index.html'));
  });
});

test('/bar/index.html', function () {
  return getLocalPath('/bar/index.html').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/bar/index.html'));
  });
});

test('../../../foo', function () {
  return getLocalPath('/foo').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './test/foo.html'));
  });
});

test('/baz (fail test)', function () {
  return getLocalPath('/baz')
    .then(function (result) {
      expect(result).toBe(
        '/Users/ryan/Development/url-path-to-local-path/test/baz.html'
      );
    })
    .catch(function (error) {
      expect(error).toBeTruthy();
    });
});
