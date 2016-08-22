'use strict';

var merge = require('../merge');

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
    transactions: function transactions(accountId, callback) {
      //
      // Gets an index of all transactions for a given account.
      //
      // @param {string} accountId the account id
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/affiliation/accounts/' + accountId + '/transactions'
      });

      return maybePromiseRequest(options, callback);
    }
  };
}

module.exports = accounts;
