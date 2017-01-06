'use strict';

var expect = require('expect.js');
var nock = require('nock');
var Q = require('q');

var client = require('../../../index');

describe('lib/resources/merchants', function() {

  before(function() {
    nock.disableNetConnect();

    var config = {
      promise: function(resolver) { return Q.Promise(resolver); }
    };

    this.callbackClient = client('sk-XXX').merchants;
    this.promiseClient = client('sk-XXX', config).merchants;
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#all', function() {

    beforeEach(function() {
      this.merchants = [{ 'id': 'org-1' }];
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/merchants')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.merchants });
    });

    it('gets a list of merchants with a callback', function(done) {
      this.callbackClient.all(function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.merchants);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets a list of merchants with a promise', function(done) {
      this.promiseClient.all().then(function(result) {
        expect(result.data).to.eql(this.merchants);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

    it('gets a list of merchants with query params', function(done) {
      var scope = nock('https://api.usebutton.com:443')
        .get('/v1/merchants?status=pending&currency=USD')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.merchants });

      this.promiseClient.all({
        status: 'pending',
        currency: 'USD'
      }).then(function(result) {
        expect(result.data).to.eql(this.merchants);
        scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
