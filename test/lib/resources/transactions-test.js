'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').transactions;
let nock = require('nock');

describe('lib/resources/transactions', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#all', function() {
    beforeEach(function() {
      this.transactions = [
        { id: 'tx-1' },
        { id: 'tx-2' }
      ];
    });

    it('gets a list of transactions with a promise', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.all().then((result) => {
        expect(result.data).to.eql(this.transactions);
        this.scope.done();
      });
    });

    it('accepts an options object', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/transactions?cursor=cursor&start=2015-01-01T00%3A00%3A00Z&end=2016-01-01T00%3A00%3A00Z&time_field=modified_date')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.all({
        cursor: 'cursor',
        start: '2015-01-01T00:00:00Z',
        end: '2016-01-01T00:00:00Z',
        time_field: 'modified_date'
      }).then((result) => {
        expect(result.data).to.eql(this.transactions);
        this.scope.done();
      });
    });

    it('only includes passed options', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/transactions?cursor=cursor')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.all({
        cursor: 'cursor'
      }).then((result) => {
        expect(result.data).to.eql(this.transactions);
        this.scope.done();
      });
    });

  });

});
