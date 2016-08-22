'use strict';

var https = require('https');
var once = require('./once');

function request(timeout) {
  //
  // request issues an https request.  To generate a function that will issue
  // network requests, you must call this module with an optional timeout.
  // The returned function may then be invoked with arguments specific to a
  // given request.
  //
  // ## Usage
  //
  // request(3000)({
  //   method: 'GET',
  //   path: '/v1/blorp/blorp-1'
  //   hostname: 'api.bloop.com',
  // }, function(err, res) {
  //   ...
  // });
  //
  // request(3000)({
  //   method: 'POST',
  //   path: '/v1/blorp/blorp-1'
  //   hostname: 'api.bloop.com',
  //   auth: apiKey + ':',
  //   headers: { 'Content-Type': 'application/json' }
  // }, { type: blorp, blorpCount: 1 }, function(err, res) {
  //   ...
  // });
  //
  return function _request(options, data, callback) {

    if (typeof data === 'function') {
      callback = data;
      data = null;
    }

    callback = once(callback);

    var req = https.request(options);

    req.on('response', responseHandler(callback));
    req.on('error', errorHandler(callback));

    if (typeof timeout === 'number') {
      req.setTimeout(timeout, timeoutHandler(callback, req));
    }

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  };
}

function responseHandler(callback) {
  return function _responseHandler(res) {
    res.setEncoding('utf8');
    var rawResponse = '';

    res.on('data', function onData(chunk) {
      rawResponse = rawResponse + chunk;
    });

    res.on('end', function onEnd() {
      if (!rawResponse) {
        return callback(
          new Error('Client received an empty response from the server'),
          null
        );
      }

      try {
        var response = JSON.parse(rawResponse);
      } catch (e) {
        return callback(new Error('Error parsing response as JSON: ' + rawResponse), null);
      }

      if (typeof response.meta !== 'object' || !response.meta.status) {
        return callback(new Error('Invalid response: ' + rawResponse), null);
      }

      var status = response.meta.status;

      if (status === 'ok') {
        return callback(null, unpackResponse(response));
      } else if (status === 'error') {
        if (typeof response.error !== 'object' || !response.error.message) {
          return callback(new Error('Invalid response: ' + rawResponse), null);
        }

        return callback(new Error(response.error.message), null);
      } else {
        return callback(new Error('Unknown status: ' + status), null);
      }
    });
  };
}

function errorHandler(callback) {
  return function _errorHandler(e) {
    callback(e, null);
  };
}

function timeoutHandler(callback, req) {
  return function _timeoutHandler() {
    req.abort();
    callback(new Error('Request timed out'), null);
  };
}

function unpackResponse(response) {
  if (response.object !== undefined) {
    return response.object;
  } else {
    return response.objects;
  }
}

module.exports = request;
