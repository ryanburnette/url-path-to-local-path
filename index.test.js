'use strict';

var UrlPathToLocalPath = require('./');
var path = require('path');

var getLocalPath = UrlPathToLocalPath();

test('/', function (done) {
  getLocalPath('/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/index.html'));
    done();
  });
});

test('/index.html', function (done) {
  getLocalPath('/index.html').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/index.html'));
    done();
  });
});

test('/foo', function (done) {
  getLocalPath('/foo').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/foo.html'));
    done();
  });
});

test('/foo/', function (done) {
  getLocalPath('/foo/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/foo.html'));
    done();
  });
});

test('/bar', function (done) {
  getLocalPath('/bar').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/bar/index.html'));
    done();
  });
});

test('/bar/', function (done) {
  getLocalPath('/bar/').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/bar/index.html'));
    done();
  });
});

test('/bar/index.html', function (done) {
  getLocalPath('/bar/index.html').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/bar/index.html'));
    done();
  });
});

test('../../../foo', function (done) {
  getLocalPath('/foo').then(function (fn) {
    expect(fn).toBe(path.resolve(__dirname, './content/foo.html'));
    done();
  });
});
