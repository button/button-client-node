'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').merchants;
let nock = require('nock');


describe('lib/resources/merchants', function() {

  before(function() {
    nock.disableNetConnect();
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

    it('gets a list of merchants with a promise', function() {
      return client.all().then((result) => {
        expect(result.data).to.eql(this.merchants);
        this.scope.done();
      });
    });

    it('gets a list of merchants with query params', function() {
      this.scope = nock('https://api.usebutton.com:443')
        .get('/v1/merchants?status=pending&currency=USD')
        .reply(200, { meta: { status: 'ok' }, 'objects': this.merchants });

      return client.all({
        status: 'pending',
        currency: 'USD'
      }).then((result) => {
        expect(result.data).to.eql(this.merchants);
        this.scope.done();
      });
    });

  });

});
