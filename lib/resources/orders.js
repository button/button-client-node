'use strict';

var merge = require('../merge');

function orders(requestOptions, maybePromiseRequest) {
  return {
    get: function get(orderId, callback) {
      //
      // Gets an order.
      //
      // @param {string} orderId the order id
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/order/' + orderId
      });

      return maybePromiseRequest(options, callback);
    },
    getByBtnRef: function get(btnRef, callback) {
      //
      // Lists orders by btn_ref.
      //
      // @param {string} btnRef the button attribution token
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      var options = merge(requestOptions, {
        method: 'GET',
        path: '/v1/order/btn-ref/' + btnRef
      });

      return maybePromiseRequest(options, callback);
    },
    create: function create(order, callback) {
      //
      // Creates an order.
      //
      // @param {Object} order the order
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/order'
      });

      return maybePromiseRequest(options, order, callback);
    },
    update: function update(orderId, order, callback) {
      //
      // Updates an order.
      //
      // @param {string} orderId the order id
      // @param {Object} order the order
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/order/' + orderId
      });

      return maybePromiseRequest(options, order, callback);
    },
    del: function del(orderId, callback) {
      //
      // Deletes an order.
      //
      // @param {string} orderId the order id
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'DELETE',
        path: '/v1/order/' + orderId
      });

      return maybePromiseRequest(options, callback);
    }
  };
}

module.exports = orders;
