'use strict';

function maybePromise(f, promise) {
  //
  // maybePromise accepts a function #f and a promise generator function
  // #promise.  #f is a node style async function accepting a callback as its
  // last argument.  If #promise isn't valid, #maybePromise` will transparently
  // return f as a noop. If #promise is valid, #maybePromise will use return
  // a function that must be called as if it was #f (callback and all) but will
  // instead return a promise to be fulfilled or rejected by the underling async
  // action.
  //
  // ## Usage
  //
  // function getBlorp(blorpId, callback) {
  //   // will either invoke callback(null, { type: "blorp" }) on success
  //   // or callback(new Error("Blorp unavailable")) on failure.
  // }
  //
  // function getPromise(resolver) {
  //   return new Promise(resolver);
  // }
  //
  // maybePromise(getBlorp, getPromise)("blorp-1", undefined).then(function(result) {
  //   console.log("getBlorp succeeded");
  // }, function(reason) {
  //   console.error("getBlorp failed");
  // });
  //
  // maybePromise(getBlorp)("blorp-1", function(err, res) {
  //   if (err) {
  //     console.error("getBlorp failed");
  //   }
  //
  //   console.log("getBlorp succeeded");
  // });
  //
  // @param {Func} f a node-style async function
  // @param {Func} promise a function accepting a resolver function and
  //   returning a promise
  // @returns {Func} a function to be invoked as f that will optionally return
  //   a promise.
  //
  if (!promise || typeof promise !== 'function') {
    return f;
  }

  return function() {
    var args = Array.prototype.slice.call(arguments, 0, -1);
    return promise(function(resolve, reject) {
      f.apply(null, args.concat(function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }));
    });
  };
}

module.exports = maybePromise;
