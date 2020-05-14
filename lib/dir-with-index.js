'use strict';

module.exports = function (s) {
  s = String(s);
  return s.substring(0, s.lastIndexOf('.')) + '/index' + s.substring(s.lastIndexOf('.'));
};
