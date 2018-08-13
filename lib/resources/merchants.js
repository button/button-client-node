'use strict';

const merge = require('../merge');
const formatQuery = require('../formatQuery');

function merchants(requestOptions, requestPromise) {
  return {
    all: function all(params) {
      //
      // Gets an index of all merchants.
      //
      // @param {Object=} params an object of optional options for the
      //   request
      // @param {string=} params.status Partnership status to filter by. One of
      //   ('approved', 'pending', or 'available')
      // @param {string=} params.currency an ISO-4217 currency code to filter
      //   results by
      // @returns {Object=} a promise
      //
      if (Object.prototype.toString.call(params) !== '[object Object]') {
        params = {};
      }

      const query = formatQuery({
        status: params.status,
        currency: params.currency
      });

      const options = merge(requestOptions, {
        method: 'GET',
        path: `/v1/merchants${query}`
      });

      return requestPromise(options);
    }
  };
}

module.exports = merchants;
