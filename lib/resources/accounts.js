'use strict';

var merge = require('../merge');
var formatQuery = require('../formatQuery');

function accounts(requestOptions, maybePromiseRequest) {
  return {
    all: function all(callback) {
      //
      // Gets an index of all available accounts.
      //
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/affiliation/accounts'
      });

      return maybePromiseRequest(options, callback);
    },
    transactions: function transactions(accountId, params, callback) {
      //
      // Gets an index of all transactions for a given account.
      //
      // @param {string} accountId the account id
      // @param {Object=} params an object of optional options for the
      //                  request
      // @param {string=} params.cursor an opague string returned by a response
      //                  which returns consistent results
      // @param {string=} params.start an ISO-8601 datetime to filter results
      // @param {string=} params.end an ISO-8601 datetime to filter results
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
        cursor: params.cursor,
        start: params.start,
        end: params.end
      });

      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/affiliation/accounts/' + accountId + '/transactions' + query
      });

      return maybePromiseRequest(options, callback);
    }
  };
}

module.exports = accounts;
