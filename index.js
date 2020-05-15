'use strict';

var fs = require('fs');
var path = require('path');
var url = require('url');

module.exports = function (opts = {}) {
  opts.context = opts.context || './content';

  var localExtensions = opts.localExtension || opts.localExtensions || '.html';

  if (!Array.isArray(localExtensions)) {
    localExtensions = [localExtensions];
  }

  return async function (reqPath) {
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
      return Promise.resolve(false);
    }

    return Promise.all(
      localExtensions
        .map(function (lext) {
          var tryFile = replaceExtension(reqPath, lext);
          return [tryFile, dirWithIndex(tryFile)];
        })
        .flat()
        .map(function (fn) {
          return fs.promises
            .stat(fn)
            .then(() => fn)
            .catch(() => false);
        })
    ).then(function (checks) {
      var found = checks.find(el => el);
      if (!found) {
        var e1 = new Error('local path not found');
        e1.code = 'ENOENT';
        throw e1;
      }
      return found;
    });
  };
};

function removeQuery(theUrl) {
  var obj = url.parse(theUrl);
  obj.search = obj.query = '';
  return url.format(obj);
}

function removeTrailingSlash(str) {
  return str.replace(/[\\/]+$/, '');
}

function replaceExtension(pth, ext) {
  if (typeof pth !== 'string') {
    pth = String(pth);
  }
  if (pth.length === 0) {
    return pth;
  }
  var fileName = path.basename(pth, path.extname(pth)) + ext;
  return path.join(path.dirname(pth), fileName);
}

function dirWithIndex(s) {
  s = String(s);
  return (
    s.substring(0, s.lastIndexOf('.')) +
    '/index' +
    s.substring(s.lastIndexOf('.'))
  );
}
