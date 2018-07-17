'use strict';

const expect = require('chai').expect;
const compact = require('lib').compact;

describe('lib/#compact', function() {

  it('strips an object of false-y values', function() {
    var obj = { a: 1, b: 0, c: null, d: undefined, e: '', f: NaN };
    expect(compact(obj)).to.deep.equal({ a: 1 });
  });

  it('returns a copy instead of mutating the input', function() {
    var obj = { a: 1, b: 0, c: null, d: undefined, e: '' };
    expect(compact(obj)).to.deep.equal({ a: 1 });
    expect(obj).to.deep.equal({ a: 1, b: 0, c: null, d: undefined, e: '' });
  });

});
