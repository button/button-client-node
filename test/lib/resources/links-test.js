'use strict';

const expect = require('expect.js');
const client = require('../../../index')('sk-XXX').links;
let nock = require('nock');

describe('lib/resources/links', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#create', () => {
    beforeEach(() => {
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

    afterEach(() => this.scope.done());

    it('creates a link with a promise', () => {
      return client.create(this.payload).then((result) => {
        expect(result.data).to.eql(this.link);
      });
    });

  });

  describe('#getInfo', () => {
    beforeEach(() => {
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

    afterEach(() => this.scope.done());

    it('gets information for a link with a promise', () => {
      return client.getInfo(this.payload).then((result) => {
        expect(result.data).to.eql(this.link);
      });
    });

  });

});
