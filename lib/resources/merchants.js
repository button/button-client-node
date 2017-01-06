'use strict';

var merge = require('../merge');
var formatQuery = require('../formatQuery');

function merchants(requestOptions, maybePromiseRequest) {
  return {
    all: function all(params, callback) {
      //
      // Gets an index of all merchants.
      //
      // @param {Object=} params an object of optional options for the
      //   request
      // @param {string=} params.status Partnership status to filter by. One of
      //   ('approved', 'pending', or 'available')
      // @param {string=} params.currency an ISO-4217 currency code to filter
      //   results by
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
