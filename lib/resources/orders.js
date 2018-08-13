'use strict';

const merge = require('../merge');

function orders(requestOptions, requestPromise) {
  return {
    get: function get(orderId) {
      //
      // Gets an order.
      //
      // @param {string} orderId the order id
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'GET',
        path: `/v1/order/${orderId}`
      });
      
      return requestPromise(options);
    },
    getByBtnRef: function get(btnRef) {
      //
      // Lists orders by btn_ref.
      //
      // @param {string} btnRef the button attribution token
      // @returns {Object=} a promise
      const options = merge(requestOptions, {
        method: 'GET',
        path: `/v1/order/btn-ref/${btnRef}`
      });

      return requestPromise(options);
    },
    create: function create(order) {
      //
      // Creates an order.
      //
      // @param {Object} order the order
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/order'
      });

      return requestPromise(options, order);
    },
    update: function update(orderId, order) {
      //
      // Updates an order.
      //
      // @param {string} orderId the order id
      // @param {Object} order the order
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: `/v1/order/${orderId}`
      });

      return requestPromise(options, order);
    },
    del: function del(orderId) {
      //
      // Deletes an order.
      //
      // @param {string} orderId the order id
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'DELETE',
        path: `/v1/order/${orderId}`
      });

      return requestPromise(options);
    }
  };
}

module.exports = orders;
