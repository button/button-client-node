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
    let orderId;
    let order;
    let scope;

    beforeEach(function() {
      orderId = 'btnorder-XXX';
      order = { 'button_order_id': 'btnorder-XXX' };
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': order });
    });

    afterEach(() => scope.done());

    it('gets an order with a promise', () => {
      return client.get(orderId).then((result) => {
        expect(result.data).to.eql(order);
      });
    });

  });

  describe('#getByBtnRef', function() {
    let btnRef;
    let order;
    let scope;

    beforeEach(function() {
      btnRef = 'srctok-XXX';
      order = { 'button_order_id': 'srctok-XXX' };
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/order/btn-ref/' + btnRef)
        .reply(200, { meta: { status: 'ok' }, 'objects': [order] });
    });

    afterEach(() => scope.done());

    it('gets an order with a promise', () => {
      return client.getByBtnRef(btnRef).then((result) => {
        expect(result.data[0]).to.eql(order);
      });
    });

  });

  describe('#create', function() {
    let payload;
    let order;
    let scope;

    beforeEach(function() {
      const total = 50;
      const currency = 'USD';
      const orderId = '1989';
      const purchaseDate = '2017-07-25T08:23:52Z';
      const finalizationDate = '2017-08-02T19:26:08Z';

      payload = {
        total: total,
        currency: currency,
        order_id: orderId,
        purchase_date: purchaseDate,
        finalization_date: finalizationDate
      };

      order = {
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

      scope = nock('https://api.usebutton.com:443')
        .post('/v1/order', payload)
        .reply(200, { meta: { status: 'ok' }, 'object': order });
    });

    afterEach(() => scope.done());

    it('creates an order with a promise', () => {
      return client.create(payload).then((result) => {
        expect(result.data).to.eql(order);
      });
    });

  });

  describe('#update', function() {
    let payload;
    let order;
    let orderId;
    let scope;

    beforeEach(function() {
      const total = 60;
      orderId = '1989';

      payload = {
        total: total,
        order_id: orderId
      };

      order = {
        button_order_id: 'btnorder-XXX',
        total: total,
        order_id: orderId,
        btn_ref: null,
        session_id: null,
        ifa: null,
        line_items: [],
        status: 'open'
      };

      scope = nock('https://api.usebutton.com:443')
        .post('/v1/order/' + orderId, payload)
        .reply(200, { meta: { status: 'ok' }, 'object': order });
    });

    afterEach(() => scope.done());

    it('updates an order with a promise', () => {
      return client.update(orderId, payload).then((result) => {
        expect(result.data).to.eql(order);
      });
    });

  });

  describe('#del', function() {
    let orderId;
    let scope;

    beforeEach(function() {
      orderId = '1989';

      scope = nock('https://api.usebutton.com:443')
        .delete('/v1/order/' + orderId)
        .reply(200, { meta: { status: 'ok' }, 'object': null });
    });

    afterEach(() => scope.done());

    it('deletes an order with a promise', () => {
      return client.del(orderId).then((result) => {
        expect(result.data).to.eql(null);
      });
    });

  });

});
