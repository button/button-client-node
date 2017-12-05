'use strict';

var expect = require('expect.js');
var nock = require('nock');
var Q = require('q');

var client = require('../../../index');

describe('lib/resources/links', function() {

  before(function() {
    nock.disableNetConnect();

    var config = {
      promise: function(resolver) { return Q.Promise(resolver); }
    };

    this.callbackClient = client('sk-XXX').links;
    this.promiseClient = client('sk-XXX', config).links;
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#create', function() {

    beforeEach(function() {
      this.url = 'https://www.jet.com/';
      this.experience = {
        btn_pub_ref: 'my-pub-ref',
        btn_pub_user: 'user-id'
      };

      this.payload = {
        url: this.url,
        experience: this.experience
      };

      this.link = {
        merchant_id: 'org-XXX',
        affiliate: null,
        links: {
          universal: 'https://r.bttn.io?btn_pub_ref=my-pub-ref&btn_pub_user=user-id&btn_url=https%3A%2F%2Fwww.jet.com&btn_ref=org-XXX'
        }
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/links', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.link });
    });

    it('creates a link with a callback', function(done) {
      this.callbackClient.create(this.payload, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.link);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('creates a link with a promise', function(done) {
      this.promiseClient.create(this.payload).then(function(result) {
        expect(result.data).to.eql(this.link);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

  describe('#getInfo', function() {

    beforeEach(function() {
      this.url = 'https://www.jet.com/';

      this.payload = {
        url: this.url
      };

      this.link = {
        organization_id: 'org-XXX',
        approved: true,
        ios_support: {
          app_to_web: true,
          app_to_app: true,
          web_to_web: true,
          web_to_app: false,
          web_to_app_with_install: false
        },
       android_support: {
          app_to_web: true,
          app_to_app: true,
          web_to_web: true,
          web_to_app: false,
          web_to_app_with_install: false
        }
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/links/info', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.link });
    });

    it('gets information for a link with a callback', function(done) {
      this.callbackClient.create(this.payload, function(err, res) {
        expect(err).to.be(null);
        expect(res.data).to.eql(this.link);
        this.scope.done();
        done();
      }.bind(this));
    });

    it('gets information for a link with a promise', function(done) {
      this.promiseClient.create(this.payload).then(function(result) {
        expect(result.data).to.eql(this.link);
        this.scope.done();
        done();
      }.bind(this)).catch(done);
    });

  });

});
