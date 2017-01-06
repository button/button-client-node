'use strict';

function compact(obj) {
  //
  // compact removes false-y values from an object
  //
  // ## Usage
  //
  // compact({ a: 1, b: 0, c: null, d: undefined, e: '', f: NaN })
  // // => { a: 1 }
  //
  // @param {Object} obj the object to compact
  // @returns {Object} a new object with only truth-y values remaning
  //
  var res = {};

  for (var key in obj) {
    if (obj[key]) {
      res[key] = obj[key];
    }
  }

  return res;
}

module.exports = compact;
