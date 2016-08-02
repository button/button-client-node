'use strict';

function once(f) {
  //
  // Once accepts any function and returns a new one which will only allow #f
  // to be invoked once.
  //
  // ## Usage
  //
  // function f() {
  //   console.log('called');
  // }
  //
  // var wrapped = once(f);
  // wrapped();
  // wrapped(); // will only log 'called' once.
  //
  // @param {Func} f the function to ensure only gets called once
  // @returns {Func} a function that will only allow #f to be called once
  //
  var called = false;
  return function() {
    if (called) {
      return;
    }

    called = true;
    f.apply(null, Array.prototype.slice.call(arguments));
  };
}

module.exports = once;
