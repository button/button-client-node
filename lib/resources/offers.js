'use strict';

const merge = require('../merge');

function offers(requestOptions, requestPromise) {
  return {
    get: function get(user) {
      //
      // Gets personalized rates
      //
      // @param {Object} user object of user information
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/offers'
      });

      return requestPromise(options, user);
    }
  };
}

module.exports = offers;
