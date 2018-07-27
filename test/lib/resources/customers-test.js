'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').customers;
let nock = require('nock');

describe('lib/resources/customers', function() {

  before(function() {
    nock.disableNetConnect();
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

    afterEach(function() {
      this.scope.done();
    });

    it('gets a customer with a promise', function() {
      return client.get(this.customerId).then((result) => {
        expect(result.data).to.eql(this.customer);
      });
    });

  });

  describe('#create', function() {
    beforeEach(function() {
      this.customerId = 'customer-1234';

      this.payload = {
        customer_id: this.customerId
      };

      this.customer = {
        id: 'customer-1234'
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/customers', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.customer });
    });

    afterEach(function() {
      this.scope.done();
    });

    it('creates a customer with a promise', function() {
      return client.create(this.payload).then((result) => {
        expect(result.data).to.eql(this.customer);
      });
    });

  });

});
