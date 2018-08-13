'use strict';

const merge = require('../merge');

function links(requestOptions, requestPromise) {
  return {
    create: function create(link) {
      //
      // Creates a link.
      //
      // @param {Object} link object of link information
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/links'
      });

      return requestPromise(options, link);
    },
    getInfo: function getInfo(link) {
      //
      // Gets information for a link.
      //
      // @param {Object} link object of link information
      // @returns {Object=} a promise
      //
      const options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/links/info'
      });

      return requestPromise(options, link);
    }
  };
}

module.exports = links;
