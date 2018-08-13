'use strict';

const https = require('https');
const http = require('http');
const parse = require('url').parse;

function request(timeout, secure) {
  //
  // request issues an https request.  To generate a function that will issue
  // network requests, you must call this module with an optional timeout and
  // optional boolean for whether or not to use HTTPS.
  //
  // The returned function may then be invoked with arguments specific to a
  // given request and will return a promise.
  //
  // ## Usage
  //
  // request(3000, true)({
  //   method: 'GET',
  //   path: '/v1/blorp/blorp-1'
  //   hostname: 'api.bloop.com',
  // }).then()
  //
  // request(3000, true)({
  //   method: 'POST',
  //   path: '/v1/blorp/blorp-1'
  //   hostname: 'api.bloop.com',
  //   auth: apiKey + ':',
  //   headers: { 'Content-Type': 'application/json' }
  // }, { type: blorp, blorpCount: 1 }).then()
  //
  return function _request(options, data) {
    return new Promise((resolve, reject) => {
      const req = (secure ? https : http).request(options);

      req.on('response', responseHandler(resolve, reject));
      req.on('error', reject);

      if (typeof timeout === 'number') {
        req.setTimeout(timeout, timeoutHandler(reject, req));
      }

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  };
}

function responseHandler(resolve, reject) {
  return function _responseHandler(res) {
    res.setEncoding('utf8');
    let rawResponse = '';

    res.on('data', function onData(chunk) {
      rawResponse = rawResponse + chunk;
    });

    res.on('end', function onEnd() {
      if (!rawResponse) {
        return reject(formatError('Client received an empty response from the server', res));
      }

      let response;

      try {
        response = JSON.parse(rawResponse);
      } catch (e) {
        return reject(formatError(`Error parsing response as JSON: ${rawResponse}`, res));
      }

      if (typeof response.meta !== 'object' || !response.meta.status) {
        return reject(formatError(`Invalid response: ${rawResponse}`, res));
      }

      const status = response.meta.status;

      if (status === 'ok') {
        return resolve(formatResponse(response));
      }

      let msg;
      if (status === 'error') {
        if (typeof response.error !== 'object' || !response.error.message) {
          msg = `Invalid response: ${rawResponse}`;
        } else {
          msg = response.error.message;
        }
      } else {
        msg = `Unknown status: ${status}`;
      }
      return reject(formatError(msg, res));
    });
  };
}

function timeoutHandler(reject, req) {
  return function _timeoutHandler() {
    req.abort();
    reject(new Error('Request timed out'));
  };
}

function formatResponse(response) {
  return {
    data: response.object !== undefined ? response.object : response.objects,
    meta: {
      next: formatCursor(response.meta.next),
      previous: formatCursor(response.meta.previous)
    }
  };
}

function formatError(message, response) {
  var err = new Error(message);
  err.response = response;
  return err;
}

function formatCursor(url) {
  if (typeof url === 'string') {
    var parsed = parse(url, true);
    return parsed.query.cursor || null;
  } else {
    return null;
  }
}

module.exports = request;
