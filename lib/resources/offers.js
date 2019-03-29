'use strict';

const merge = require('../merge');

function offers(requestOptions, requestPromise) {
  return {
    get: function get(params) {
      //
      // Gets personalized rates
      //
      // @param {Object} link object of link information
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/offers'
      });

      return requestPromise(options, params);
    }
  };
}

module.exports = offers;
