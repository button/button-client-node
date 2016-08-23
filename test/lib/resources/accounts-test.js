'use strict';

var expect = require('expect.js');
var nock = require('nock');
var Q = require('q');

var client = require('../../../index');

describe('lib/resources/accounts', function() {

  before(function() {
    nock.disableNetConnect();

    var config = {
      promise: function(resolver) { return Q.Promise(resolver); }
    };

    this.callbackClient = client('sk-XXX').accounts;
    this.promiseClient = client('sk-XXX', config).accounts;
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

    it('gets a list of accounts with a callback', function(done) {
      this.callbackClient.all(function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.accounts);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets a list of accounts with a promise', function(done) {
      this.promiseClient.all().then(function(result) {
        expect(result.data).to.eql(this.accounts);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
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

    it('gets a list of transactions with a callback', function(done) {
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      this.callbackClient.transactions(this.accountId, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.transactions);
        scope.done();
        done();
      }.bind(this));
    });

    it('gets a list of transactions with a promise', function(done) {
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      this.promiseClient.transactions(this.accountId).then(function(result) {
        expect(result.data).to.eql(this.transactions);
        scope.done();
        done();
      }.bind(this)).catch(done);
    });

    it('accepts an options object', function(done) {
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions?cursor=cursor&start=2015-01-01T00%3A00%3A00Z&end=2016-01-01T00%3A00%3A00Z')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      this.promiseClient.transactions(this.accountId, {
        cursor: 'cursor',
        start: '2015-01-01T00:00:00Z',
        end: '2016-01-01T00:00:00Z'
      }).then(function(result) {
        expect(result.data).to.eql(this.transactions);
        scope.done();
        done();
      }.bind(this)).catch(done);
    });

    it('only includes passed options', function(done) {
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions?cursor=cursor')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });

      this.promiseClient.transactions(this.accountId, {
        cursor: 'cursor'
      }).then(function(result) {
        expect(result.data).to.eql(this.transactions);
        scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
