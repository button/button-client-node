var resources = require('./lib').resources;
var maybePromise = require('./lib').maybePromise;
var version = require('./package.json').version;

module.exports = function client(apiKey, config) {
  //
  // #client provides the top-level interface to making API requests to Button.
  // It requires a Button API key, which can be found at
  // https://app.usebutton.com/settings/organization.
  //
  // @param {string} apiKey your Button API key
  // @param {Object=} config an optional object
  // @param {number=} config.timeout a timeout in ms to abort API calls
  // @param {Func=} config.promise a function which should return a promise
  // @returns {Object} a client
  //
  if (!apiKey) {
    throw new Error('Must provide a Button API key.  Find yours at https://app.usebutton.com/settings/organization');
  }

  if (!config) {
    config = {};
  }

  var requestOptions = {
    hostname: 'api.usebutton.com',
    auth: apiKey + ':',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'button-client-node/' + version + ' Node/' + process.versions.node
    }
  };

  return {
    orders: resources.orders(requestOptions, config)
  };
}
