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
    let accounts;
    let scope;

    beforeEach(() => {
      accounts = [{ 'id': 'acc-1' }];
      
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts')
        .reply(200, { meta: { status: 'ok' }, 'objects': accounts });
    });

    afterEach(() => scope.done());

    it('gets a list of accounts with a promise', () => {
      return client.all().then((result) => {
        expect(result.data).to.eql(accounts);
      });
    });

  });

  describe('#transactions', function() {
    let accountId;
    let transactions;
    let scope;

    beforeEach(() => {
      accountId = 'acc-1';
      transactions = [
        { id: 'tx-1' },
        { id: 'tx-2' }
      ];
    });

    afterEach(() => scope.done());

    it('gets a list of transactions with a promise', () => {
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + accountId + '/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': transactions });

      return client.transactions(accountId).then((result) => {
        expect(result.data).to.eql(transactions);
      });
    });

    it('accepts an options object', () => {
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + accountId + '/transactions?cursor=cursor&start=2015-01-01T00%3A00%3A00Z&end=2016-01-01T00%3A00%3A00Z')
        .reply(200, { meta: { status: 'ok' }, 'objects': transactions });

      return client.transactions(accountId, {
        cursor: 'cursor',
        start: '2015-01-01T00:00:00Z',
        end: '2016-01-01T00:00:00Z'
      }).then((result) => {
        expect(result.data).to.eql(transactions);
      });
    });

    it('only includes passed options', () => {
      scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + accountId + '/transactions?cursor=cursor')
        .reply(200, { meta: { status: 'ok' }, 'objects': transactions });

      return client.transactions(accountId, {
        cursor: 'cursor'
      }).then((result) => {
        expect(result.data).to.eql(transactions);
      });
    });

  });

});
