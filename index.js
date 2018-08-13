const resources = require('./lib').resources;
const request = require('./lib').request;
const merge = require('./lib').merge;
const compact = require('./lib').compact;
const utils = require('./lib').utils;
const version = require('./package.json').version;

module.exports = client;

const configDefaults = {
  secure: true,
  timeout: false
};

function headers(apiVersion) {
  const nodeVersion = process.versions.node;
  const userAgent = 'button-client-node/' + version + ' node/' + nodeVersion;

  return merge(compact({ 'X-Button-API-Version': apiVersion }), {
    'Content-Type': 'application/json',
    'User-Agent': userAgent
  });
}

function client(apiKey, config) {
  //
  // #client provides the top-level interface to making API requests to Button.
  // It requires a Button API key, which can be found at
  // https://app.usebutton.com/settings/organization.
  //
  // @param {string} apiKey your Button API key
  // @param {Object=} config an optional object
  // @param {string=} config.hostname defaults to 'api.usebutton.com'
  // @param {number=} config.port defaults to 443 if config.secure else 80
  // @param {bool=} config.secure will use HTTPS if true and HTTP if false
  // @param {number=} config.timeout a timeout in ms to abort API calls
  // @param {string=} config.apiVersion a string pinning your API version for
  //   the request (YYYY-MM-DD)
  // @returns {Object} a client
  //
  if (!apiKey) {
    throw new Error('Must provide a Button API key.  Find yours at https://app.usebutton.com/settings/organization');
  }

  config = merge(configDefaults, config);

  const requestConfig = merge({
    hostname: 'api.usebutton.com',
    port: config.secure ? 443 : 80
  }, compact({
    hostname: config.hostname,
    port: config.port
  }));

  const requestOptions = merge(requestConfig, {
    auth: apiKey + ':',
    headers: headers(config.apiVersion)
  });

  const requestPromise = request(config.timeout, config.secure);
  return {
    accounts: resources.accounts(requestOptions, requestPromise),
    customers: resources.customers(requestOptions, requestPromise),
    links: resources.links(requestOptions, requestPromise),
    merchants: resources.merchants(requestOptions, requestPromise),
    orders: resources.orders(requestOptions, requestPromise)
  };
}

client.utils = utils;
