'use strict';

var merge = require('../merge');

function links(requestOptions, maybePromiseRequest) {
  return {
    create: function create(link, callback) {
      //
      // Creates a link.
      //
      // @param {Object} link object of link information
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/links'
      });

      return maybePromiseRequest(options, link, callback);
    },
    getInfo: function getInfo(link, callback) {
      //
      // Gets information for a link.
      //
      // @param {Object} link object of link information
      // @callback invoked iff config.promise isn't valid
      // @returns {Object=} a promise or undefined, depending on
      //   `config.promise`
      //
      var options = merge(requestOptions, {
        method: 'POST',
        path: '/v1/links/info'
      });

      return maybePromiseRequest(options, link, callback);
    }
  };
}

module.exports = links;
