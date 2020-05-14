'use strict';

var path = require('path');

module.exports = function (pth, ext) {
  if (typeof pth !== 'string') {
    pth = String(pth);
  }

  if (pth.length === 0) {
    return pth;
  }

  var fileName = path.basename(pth, path.extname(pth)) + ext;

  return path.join(path.dirname(pth), fileName);
};
