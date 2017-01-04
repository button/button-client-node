'use strict';

var expect = require('expect.js');
var nock = require('nock');

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

  it('exposes the utils module', function() {
    expect(typeof client.utils).to.eql('object');
  });

  describe('config', function() {
    before(function() {
      nock.disableNetConnect();
    });

    after(function() {
      nock.enableNetConnect();
    });

    it('defaults config options', function(done) {
      var c = client('sk-XXX').orders;
      var orderId = 'btnorder-XXX';
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      c.get(orderId, function(err) {
        expect(err).to.be(null);
        scope.done();
        done();
      }.bind(this));
    });

    it('makes insecure requests', function(done) {
      var c = client('sk-XXX', { secure: false }).orders;
      var orderId = 'btnorder-XXX';
      var scope = nock('http://api.usebutton.com:80')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      c.get(orderId, function(err) {
        expect(err).to.be(null);
        scope.done();
        done();
      }.bind(this));
    });

    it('overrides the hostname', function(done) {
      var c = client('sk-XXX', { hostname: 'staging.usebutton.com' }).orders;
      var orderId = 'btnorder-XXX';
      var scope = nock('https://staging.usebutton.com:443')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      c.get(orderId, function(err) {
        expect(err).to.be(null);
        scope.done();
        done();
      }.bind(this));
    });

    it('overrides the port', function(done) {
      var c = client('sk-XXX', { port: 1989 }).orders;
      var orderId = 'btnorder-XXX';
      var scope = nock('https://api.usebutton.com:1989')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      c.get(orderId, function(err) {
        expect(err).to.be(null);
        scope.done();
        done();
      }.bind(this));
    });

  });

});
