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
        expect(res).to.eql(this.accounts);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets a list of accounts with a promise', function(done) {
      this.promiseClient.all().then(function(result) {
        expect(result).to.eql(this.accounts);
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

      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/affiliation/accounts/' + this.accountId + '/transactions')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.transactions });
    });

    it('gets a list of transactions with a callback', function(done) {
      this.callbackClient.transactions(this.accountId, function(err, res) {
        expect(err).to.be(null);
        expect(res).to.eql(this.transactions);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets a list of transactions with a promise', function(done) {
      this.promiseClient.transactions(this.accountId).then(function(result) {
        expect(result).to.eql(this.transactions);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
