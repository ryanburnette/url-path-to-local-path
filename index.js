'use strict';

var path = require('path');
var fs = require('fs');
var removeQuery = require('./lib/remove-query');
var removeTrailingSlash = require('./lib/remove-trailing-slash');
var replaceExtension = require('./lib/replace-extension');
var dirWithIndex = require('./lib/dir-with-index');

module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }

  if (!Object.keys(opts).includes('context')) {
    opts.context = './content';
  }

  if (!Object.keys(opts).includes('checkExists')) {
    opts.checkExists = true;
  }

  var localExtensions = opts.localExtension || opts.localExtensions || '.html';

  if (!Array.isArray(localExtensions)) {
    localExtensions = [localExtensions];
  }

  return function (reqPath) {
    reqPath = removeQuery(reqPath);

    if (reqPath == '/') {
      reqPath = '/index.html';
    }

    if (!reqPath.endsWith('/') && !reqPath.endsWith('.html')) {
      reqPath = reqPath.concat('.html');
    }

    if (reqPath.endsWith('.htm')) {
      reqPath = reqPath.replace('.htm', '.html');
    }

    if (reqPath.length > 1 && reqPath.endsWith('/')) {
      reqPath = removeTrailingSlash(reqPath);
      reqPath = reqPath.concat('.html');
    }

    reqPath = opts.context + '/' + reqPath;

    reqPath = path.join.apply(null, reqPath.split('/'));

    reqPath = path.resolve(reqPath);

    if (!reqPath.startsWith(path.resolve(opts.context))) {
      return null;
    }

    var pathsToTry = localExtensions
      .map(function (lext) {
        var tryFile = replaceExtension(reqPath, lext);
        return [tryFile, dirWithIndex(tryFile)];
      })
      .flat();

    return Promise.all(
      pathsToTry.map(function (fn) {
        return fs.promises
          .stat(fn)
          .then(function (stat) {
            return fn;
          })
          .catch(function (error) {
            return null;
          });
      })
    ).then(function (attempts) {
      return attempts.find(function (el) {
        return el;
      });
    });
  };
};
