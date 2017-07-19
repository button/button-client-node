'use strict';

var expect = require('expect.js');
var nock = require('nock');
var Q = require('q');

var client = require('../../../index');

describe('lib/resources/customers', function() {

  before(function() {
    nock.disableNetConnect();

    var config = {
      promise: function(resolver) { return Q.Promise(resolver); }
    };

    this.callbackClient = client('sk-XXX').customers;
    this.promiseClient = client('sk-XXX', config).customers;
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#get', function() {

    beforeEach(function() {
      this.customerId = 'customer-XXX';
      this.customer = { 'customer_id': 'customer-XXX' };
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/customers/' + this.customerId)
        .reply(200, { meta: { status: 'ok' }, 'object': this.customer });
    });

    it('gets a customer with a callback', function(done) {
      this.callbackClient.get(this.customerId, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.customer);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets a customer with a promise', function(done) {
      this.promiseClient.get(this.customerId).then(function(result) {
        expect(result.data).to.eql(this.customer);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

  describe('#create', function() {

    beforeEach(function() {

      this.customerId = 'customer-1234';

      this.payload = {
        customer_id: this.customerId
      };

      this.customerId = {
        id: 'customer-1234'
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/customers', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.customer });
    });

    it('creates a customer with a callback', function(done) {
      this.callbackClient.create(this.payload, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.customer);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('creates a customer with a promise', function(done) {
      this.promiseClient.create(this.payload).then(function(result) {
        expect(result.data).to.eql(this.customer);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
