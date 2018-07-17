'use strict';

const expect = require('chai').expect;
const formatQuery = require('lib').formatQuery;

describe('lib/#formatQuery', function() {

  it('builds a query string with truthy values', function() {
    var obj = { a: 1, b: 0, c: null, d: undefined, e: '', f: NaN };
    expect(formatQuery(obj)).to.equal('?a=1');
  });

  it('returns empty string if no truthy values', function() {
    var obj = { b: 0, c: null, d: undefined, e: '', f: NaN };
    expect(formatQuery(obj)).to.equal('');
  });

  it('returns many params', function() {
    var obj = { a: 'bloop', b: 2, c: 'bleep' };
    expect(formatQuery(obj)).to.equal('?a=bloop&b=2&c=bleep');
  });

});
