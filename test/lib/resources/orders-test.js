'use strict';

var expect = require('expect.js');
var nock = require('nock');
var Q = require('q');

var client = require('../../../index');

describe('lib/resources/orders', function() {

  before(function() {
    nock.disableNetConnect();

    var config = {
      promise: function(resolver) { return Q.Promise(resolver); }
    };

    this.callbackClient = client('sk-XXX').orders;
    this.promiseClient = client('sk-XXX', config).orders;
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#get', function() {

    beforeEach(function() {
      this.orderId = 'btnorder-4c944faaaa747dcb';
      this.order = { 'button_order_id': 'btnorder-XXX' };
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/' + this.orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': this.order });
    });

    it('gets an order with a callback', function(done) {
      this.callbackClient.get(this.orderId, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets an order with a promise', function(done) {
      this.promiseClient.get(this.orderId).then(function(result) {
        expect(result.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

  describe('#create', function() {

    beforeEach(function() {
      this.total = 50;
      this.currency = 'USD';
      this.orderId = '1989';
      this.finalizationDate = '2017-08-02T19:26:08Z';

      this.payload = {
        total: this.total,
        currency: this.currency,
        order_id: this.orderId,
        finalization_date: this.finalizationDate
      };

      this.order = {
        button_order_id: 'btnorder-XXX',
        total: this.total,
        currency: this.currency,
        order_id: this.orderId,
        btn_ref: null,
        session_id: null,
        ifa: null,
        line_items: [],
        status: 'open',
        finalization_date: this.finalizationDate
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/order', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.order });
    });

    it('creates an order with a callback', function(done) {
      this.callbackClient.create(this.payload, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('creates an order with a promise', function(done) {
      this.promiseClient.create(this.payload).then(function(result) {
        expect(result.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

  describe('#update', function() {

    beforeEach(function() {
      this.total = 60;
      this.orderId = '1989';

      this.payload = {
        total: this.total,
        order_id: this.orderId
      };

      this.order = {
        button_order_id: 'btnorder-XXX',
        total: this.total,
        order_id: this.orderId,
        btn_ref: null,
        session_id: null,
        ifa: null,
        line_items: [],
        status: 'open'
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/order/' + this.orderId, this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.order });
    });

    it('updates an order with a callback', function(done) {
      this.callbackClient.update(this.orderId, this.payload, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('updates an order with a promise', function(done) {
      this.promiseClient.update(this.orderId, this.payload).then(function(result) {
        expect(result.data).to.eql(this.order);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

  describe('#del', function() {

    beforeEach(function() {
      this.orderId = '1989';

      this.scope = nock('https://api.usebutton.com:443')
        .delete('/v1/order/' + this.orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': null });
    });

    it('deletes an order with a callback', function(done) {
      this.callbackClient.del(this.orderId, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(null);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('deletes an order with a promise', function(done) {
      this.promiseClient.del(this.orderId).then(function(result) {
        expect(result.data).to.eql(null);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
