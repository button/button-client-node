'use strict';

const merge = require('../merge');
const formatQuery = require('../formatQuery');

function accounts(requestOptions, requestPromise) {
  return {
    all: function all() {
      //
      // Gets an index of all available accounts.
      //
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/affiliation/accounts'
      });

      return requestPromise(options);
    },
    transactions: function transactions(accountId, params) {
      //
      // Gets an index of all transactions for a given account.
      //
      // @param {string} accountId the account id
      // @param {Object=} params an object of optional options for the
      //   request
      // @param {string=} params.cursor an opaque string returned by a response
      //  which returns consistent results
      // @param {string=} params.start an ISO-8601 datetime to filter results
      // @param {string=} params.end an ISO-8601 datetime to filter results
      // @param {string=} params.time_field time field start and end filter on 
      // @returns {Object=} a promise
      //

      if (Object.prototype.toString.call(params) !== '[object Object]') {
        params = {};
      }

      const query = formatQuery({
        cursor: params.cursor,
        start: params.start,
        end: params.end,
        time_field: params.time_field
      });

      const options = merge(requestOptions, {
        method: 'GET',
        path: `/v1/affiliation/accounts/${accountId}/transactions${query}`
      });

      return requestPromise(options);
    }
  };
}

module.exports = accounts;
