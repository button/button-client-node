'use strict';

var expect = require('expect.js');

var client = require('../index');

describe('client', function() {

  it('throws if no API key is supplied', function() {
    expect(function() {
      client();
    }).to.throwError();
  });

  it('returns a client if an API key is provided', function() {
    expect(typeof client('sk-XXX').orders).to.eql('object');
  });

  it('returns a client if an API key and a config is provided', function() {
    expect(typeof client('sk-XXX', {}).orders).to.eql('object');
  });

});
