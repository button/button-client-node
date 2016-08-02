'use strict';

var expect = require('expect.js');

var index = require('../index');

describe('index', function() {

  it('throws if no API key is supplied', function() {
    expect(function() {
      index();
    }).to.throwError();
  });

  it('returns a client if an API key is provided', function() {
    var client = index('sk-XXX');
    expect(typeof client.orders).to.eql('object');
  });

  it('returns a client if an API key and a config is provided', function() {
    var client = index('sk-XXX', {});
    expect(typeof client.orders).to.eql('object');
  });

});
