'use strict';

var querystring = require('querystring');
var compact = require('./compact');

function formatQuery(obj) {
  //
  // formatQuery formats an object as a querystring, removing any falsey values
  // and prepending a '?' character if a valid querystring.
  //
  // ## Usage
  //
  // formatQuery({ a: 1, b: 0, c: null, d: undefined, e: '', f: NaN })
  // // => "?a=1"
  //
  // formatQuery({})
  // // => ""
  //
  // @param {Object} obj the object to format
  // @returns {String} A query string
  //
  var queryString = querystring.stringify(compact(obj));
  return queryString ? '?' + queryString : '';
}

module.exports = formatQuery;
