'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').offers;
let nock = require('nock');

describe('lib/resources/offers', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#create', function() {
    beforeEach(function() {
      this.user_id = 'user-id';
      this.device_ids = ['123', '456'];
      this.email_sha256s = ['abc', 'efg'];
      this.payload = {
        user_id: this.user_id,
        device_ids: this.device_ids,
        email_sha256s: this.email_sha256s
      };

      this.offer = {
        organization_id: 'org-XXX',
        approved: true,
        ios_support: {
          app_to_web: true,
          app_to_app: true,
          web_to_web: true,
          web_to_app: true,
          web_to_app_with_install: false
        },
        android_support: {
          app_to_web: true,
          app_to_app: true,
          web_to_web: true,
          web_to_app: true,
          web_to_app_with_install: false
        }
      };

      this.scope = nock('https://api.usebutton.com:443')
        .post('/v1/offers', this.payload)
        .reply(200, { meta: { status: 'ok' }, 'object': this.offer });
    });

    it('returns offers with a promise', function() {
      return client.get(this.payload).then((result) => {
        expect(result.data).to.eql(this.offer);
        this.scope.done();
      });
    });

  });

});
