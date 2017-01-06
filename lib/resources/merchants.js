'use strict';

var merge = require('../merge');
var formatQuery = require('../formatQuery');

function merchants(requestOptions, maybePromiseRequest) {
  return {
    all: function all(params, callback) {
      //
      // Gets an index of all merchants.
      //
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }

      if (Object.prototype.toString.call(params) !== '[object Object]') {
        params = {};
      }

      var query = formatQuery({
        status: params.status,
        currency: params.currency
      });

      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/merchants' + query
      });

      return maybePromiseRequest(options, callback);
    }
  };
}

module.exports = merchants;
