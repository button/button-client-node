'use strict';

const expect = require('chai').expect;
const client = require('../../../index')('sk-XXX').links;
let nock = require('nock');

describe('lib/resources/links', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  describe('#create', function() {
    let url;
    let experience;
    let payload;
    let link;
    let scope;

    beforeEach(function() {
      url = 'https://www.jet.com/';
      experience = {
        btn_pub_ref: 'my-pub-ref',
        btn_pub_user: 'user-id'
      };

      payload = {
        url: url,
        experience: experience
      };

      link = {
        merchant_id: 'org-XXX',
        affiliate: null,
        links: {
          universal: 'https://r.bttn.io?btn_pub_ref=my-pub-ref&btn_pub_user=user-id&btn_url=https%3A%2F%2Fwww.jet.com&btn_ref=org-XXX'
        }
      };

      scope = nock('https://api.usebutton.com:443')
        .post('/v1/links', payload)
        .reply(200, { meta: { status: 'ok' }, 'object': link });
    });

    afterEach(() => scope.done());

    it('creates a link with a promise', () => {
      return client.create(payload).then((result) => {
        expect(result.data).to.deep.equal(link);
      });
    });

  });

  describe('#getInfo', function() {
    let url;
    let payload;
    let link;
    let scope;

    beforeEach(function() {
      url = 'https://www.jet.com/';

      payload = {
        url: url
      };

      link = {
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

      scope = nock('https://api.usebutton.com:443')
        .post('/v1/links/info', payload)
        .reply(200, { meta: { status: 'ok' }, 'object': link });
    });

    afterEach(() => scope.done());

    it('gets information for a link with a promise', () => {
      return client.getInfo(payload).then((result) => {
        expect(result.data).to.deep.equal(link);
      });
    });

  });

});
