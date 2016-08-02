'use strict';

function merge() {
  //
  // merge combines zero to many objects without mutating its arguments.
  //
  // ## Usage
  //
  // merge({ a: 1, b: 2 }, { c: 3 }, { b: 3 })
  // // => { a: 1, b: 3, c: 3 }
  //
  // @returns {Object} a new object with all properties of the supplied
  //   arguments merged together.  Later objects in the argument list will have
  //   higher precedence than earlier objects.
  //
  var res = {};

  Array.prototype.slice.call(arguments).forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      res[key] = obj[key];
    });
  });

  return res;
}

module.exports = merge;
