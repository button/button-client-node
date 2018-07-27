'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').accounts;
let nock = require('nock');

describe('lib/resources/accounts', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#all', function() {
    beforeEach(function() {
      this.accounts = [{ 'id': 'acc-1' }];
      
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.accounts });
    });

    afterEach(function() {
      this.scope.done();
    });

    it('gets a list of accounts with a promise', function() {
      return client.all().then((result) => {
        expect(result.data).to.eql(this.accounts);
      });
    });

  });

  describe('#transactions', function() {
    beforeEach(function() {
      this.accountId = 'acc-1';
      this.transactions = [
        { id: 'tx-1' },
        { id: 'tx-2' }
      ];
    });

    afterEach(function() {
      this.scope.done();
    });

    it('gets a list of transactions with a promise', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.transactions(this.accountId).then((result) => {
        expect(result.data).to.eql(this.transactions);
      });
    });

    it('accepts an options object', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions?cursor=cursor&start=2015-01-01T00%3A00%3A00Z&end=2016-01-01T00%3A00%3A00Z')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.transactions(this.accountId, {
        cursor: 'cursor',
        start: '2015-01-01T00:00:00Z',
        end: '2016-01-01T00:00:00Z'
      }).then((result) => {
        expect(result.data).to.eql(this.transactions);
      });
    });

    it('only includes passed options', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions?cursor=cursor')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      return client.transactions(this.accountId, {
        cursor: 'cursor'
      }).then((result) => {
        expect(result.data).to.eql(this.transactions);
      });
    });

  });

});
