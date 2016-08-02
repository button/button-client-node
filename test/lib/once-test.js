'use strict';

var expect = require('expect.js');

var once = require('lib').once;

describe('lib/#once', function() {

  beforeEach(function() {
    this.callCount = 0;

    this.f = function f() {
      this.callCount = this.callCount + 1;
    }.bind(this);
  });

  it('wraps a function that can only be invoked once', function() {
    var onceF = once(this.f);
    onceF();
    onceF();

    expect(this.callCount).to.be(1);
  });

  it('doesnt share state with other invokations', function() {
    var OnceFOne = once(this.f);
    var OnceFTwo = once(this.f);

    OnceFOne();
    OnceFOne();
    OnceFTwo();
    OnceFTwo();

    expect(this.callCount).to.be(2);
  });

});
