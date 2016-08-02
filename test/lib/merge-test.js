'use strict';

var expect = require('expect.js');

var merge = require('lib').merge;

describe('lib/#merge', function() {

  it('merges two objects without mutating either', function() {
    var a = { a: 1 };
    var b = { b: 2 };

    var merged = merge(a, b);
    expect(merged).to.eql({ a: 1, b: 2 });
    expect(a).to.eql({ a: 1 });
    expect(b).to.eql({ b: 2 });
  });

  it('uses the latest instance of a key as the merged value', function() {
    var merged = merge({ a: 1 }, { a: 2 });
    expect(merged).to.eql({ a: 2 });
  });

  it('merges many objects', function() {
    var merged = merge({ a: 1 }, { a: 2 }, { b: 3, a: 3 }, { c: 4 });
    expect(merged).to.eql({ a: 3, b: 3, c: 4 });
  });

});
