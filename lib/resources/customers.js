'use strict';

var merge = require('../merge');

function customers(requestOptions, maybePromiseRequest) {
  return {
    get: function get(customerId, callback) {
      //
      // Gets a customer.
      //
      // @param {string} customerId the customer id
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/customers/' + customerId
      });

      return maybePromiseRequest(options, callback);
    },
    create: function create(customer, callback) {
      //
      // Creates a customer.
      //
      // @param {Object} customer the customer
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/customers'
      });

      return maybePromiseRequest(options, customer, callback);
    }
  };
}

module.exports = customers;
