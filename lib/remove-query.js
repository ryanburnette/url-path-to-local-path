'use strict';

var url = require('url');

module.exports = function (_url) {
  var obj = url.parse(_url);
  obj.search = obj.query = '';
  return url.format(obj);
};
