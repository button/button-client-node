'use strict';

const expect = require('expect.js');
const nock = require('nock');
const client = require('../index');

describe('client', function() {

  it('throws if no API key is supplied', function() {
    expect(() => client()).to.throwError();
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

    it('defaults config options', function() {
      let c = client('sk-XXX').orders;
      let orderId = 'btnorder-XXX';
      this.scope = nock('https://api.usebutton.com:443', {
        badheaders: ['x-button-api-version']
      }).get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      return c.get(orderId).then((results) => {
        expect(results.data).to.eql({});
        this.scope.done();
      });
    });

    it('makes insecure requests', function() {
      let c = client('sk-XXX', { secure: false }).orders;
      let orderId = 'btnorder-XXX';
      this.scope = nock('http://api.usebutton.com:80')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      return c.get(orderId).then((results) => {
        expect(results.data).to.eql({});
        this.scope.done();
      });
    });

    it('overrides the hostname', function() {
      let c = client('sk-XXX', { hostname: 'staging.usebutton.com' }).orders;
      let orderId = 'btnorder-XXX';
      this.scope = nock('https://staging.usebutton.com:443')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      return c.get(orderId).then((results) => {
        expect(results.data).to.eql({});
        this.scope.done();
      });
    });

    it('overrides the port', function() {
      let c = client('sk-XXX', { port: 1989 }).orders;
      let orderId = 'btnorder-XXX';
      this.scope = nock('https://api.usebutton.com:1989')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      return c.get(orderId).then((results) => {
        expect(results.data).to.eql({});
        this.scope.done();
      });
    });

    it('sets the API Version', function() {
      let c = client('sk-XXX', { apiVersion: '2017-01-01' }).orders;
      let orderId = 'btnorder-XXX';
      this.scope = nock('https://api.usebutton.com', {
        reqheaders: {
          'x-button-api-version': '2017-01-01'
        }
      }).get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': {} });

      return c.get(orderId).then((results) => {
        expect(results.data).to.eql({});
        this.scope.done();
      });
    });

  });

});
