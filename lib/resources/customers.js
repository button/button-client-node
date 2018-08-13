'use strict';

const merge = require('../merge');

function customers(requestOptions, requestPromise) {
  return {
    get: function get(customerId) {
      //
      // Gets a customer.
      //
      // @param {string} customerId the customer id
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/customers/' + customerId
      });

      return requestPromise(options);
    },
    create: function create(customer) {
      //
      // Creates a customer.
      //
      // @param {Object} customer the customer
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/customers'
      });

      return requestPromise(options, customer);
    }
  };
}

module.exports = customers;
