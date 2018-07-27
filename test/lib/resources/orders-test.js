'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').orders;
let nock = require('nock');

describe('lib/resources/orders', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#get', function() {
    beforeEach(function() {
      this.orderId = 'btnorder-XXX';
      this.order = { 'button_order_id': 'btnorder-XXX' };
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/' + this.orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': this.order });
    });

    afterEach(function() { 
      this.scope.done();
    });

    it('gets an order with a promise', function() {
      return client.get(this.orderId).then((result) => {
        expect(result.data).to.eql(this.order);
      });
    });

  });

  describe('#getByBtnRef', function() {
    beforeEach(function() {
      this.btnRef = 'srctok-XXX';
      this.order = { 'button_order_id': 'srctok-XXX' };
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/btn-ref/' + this.btnRef)
        .reply(200, { meta: { status: 'ok' }, 'objects': [this.order] });
    });

    afterEach(function() {
      this.scope.done();
    });

    it('gets an order with a promise', function() {
      return client.getByBtnRef(this.btnRef).then((result) => {
        expect(result.data[0]).to.eql(this.order);
      });
    });

  });

  describe('#create', function() {
    beforeEach(function() {
      const total = 50;
      const currency = 'USD';
      const orderId = '1989';
      const purchaseDate = '2017-07-25T08:23:52Z';
      const finalizationDate = '2017-08-02T19:26:08Z';

      this.payload = {
        total: total,
        currency: currency,
        order_id: orderId,
        purchase_date: purchaseDate,
        finalization_date: finalizationDate
      };

      this.order = {
        button_order_id: 'btnorder-XXX',
        total: total,
        currency: currency,
        order_id: orderId,
        btn_ref: null,
        session_id: null,
        ifa: null,
        line_items: [],
        status: 'open',
        purchase_date: purchaseDate,        
        finalization_date: finalizationDate
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/order', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.order });
    });

    afterEach(function() {
      this.scope.done();
    });

    it('creates an order with a promise', function() {
      return client.create(this.payload).then((result) => {
        expect(result.data).to.eql(this.order);
      });
    });

  });

  describe('#update', function() {
    beforeEach(function() {
      const total = 60;
      this.orderId = '1989';

      this.payload = {
        total: total,
        order_id: this.orderId
      };

      this.order = {
        button_order_id: 'btnorder-XXX',
        total: total,
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

    afterEach(function() {
      this.scope.done();
    });

    it('updates an order with a promise', function() {
      return client.update(this.orderId, this.payload).then((result) => {
        expect(result.data).to.eql(this.order);
      });
    });

  });

  describe('#del', function() {
    beforeEach(function() {
      this.orderId = '1989';

      this.scope = nock('https://api.usebutton.com:443')
        .delete('/v1/order/' + this.orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': null });
    });

    afterEach(function() {
      this.scope.done();
    });

    it('deletes an order with a promise', function() {
      return client.del(this.orderId).then((result) => {
        expect(result.data).to.eql(null);
      });
    });

  });

});
