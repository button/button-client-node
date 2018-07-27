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
    let customerId;
    let customer;
    let scope;

    beforeEach(function() {
      customerId = 'customer-XXX';
      customer = { 'customer_id': 'customer-XXX' };
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/customers/' + customerId)
        .reply(200, { meta: { status: 'ok' }, 'object': customer });
    });

    afterEach(() => scope.done());

    it('gets a customer with a promise', () => {
      return client.get(customerId).then(function(result) {
        expect(result.data).to.eql(customer);
      });
    });

  });

  describe('#create', function() {
    let customerId;
    let customer;
    let payload;
    let scope;

    beforeEach(function() {
      customerId = 'customer-1234';

      payload = {
        customer_id: customerId
      };

      customerId = {
        id: 'customer-1234'
      };

      scope = nock('https://api.usebutton.com:443')
        .post('/v1/customers', payload)
        .reply(200, { meta: { status: 'ok' }, 'object': customer });
    });

    afterEach(() => scope.done());

    it('creates a customer with a promise', () => {
      client.create(payload).then((result) => {
        expect(result.data).to.eql(customer);
      });
    });

  });

});
