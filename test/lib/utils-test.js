'use strict';

var expect = require('expect.js');

var utils = require('lib').utils;

describe('lib/utils', function() {

  describe('#isWebhookAuthentic', function() {

    it('verifies authentic requests', function() {
      var signature = '79a3a5291c94340ff0058a6319063757' +
                      '68d706357ee86826c3c692e6b9aa6817';
      var payload = '{ "a": 1 }';

      expect(utils.isWebhookAuthentic('secret', payload, 'XXX')).to.be(false);
      expect(utils.isWebhookAuthentic('secret', payload, signature)).to.be(true);
      expect(utils.isWebhookAuthentic('secret?', payload, signature)).to.be(false);
      expect(utils.isWebhookAuthentic('secret', '{ "a": 2 }', signature)).to.be(false);
    });

    it('verifies authentic requests with a buffer requestBody', function() {
      var signature = '79a3a5291c94340ff0058a6319063757' +
                      '68d706357ee86826c3c692e6b9aa6817';
      var payload = new Buffer('{ "a": 1 }');

      expect(utils.isWebhookAuthentic('secret', payload, 'XXX')).to.be(false);
      expect(utils.isWebhookAuthentic('secret', payload, signature)).to.be(true);
      expect(utils.isWebhookAuthentic('secret?', payload, signature)).to.be(false);
      expect(utils.isWebhookAuthentic('secret', new Buffer('{ "a": 2 }'), signature)).to.be(false);
    });

    it('verifies authentic requests with a unicode requestBody', function() {
      var signature = '3040cf48ab225ca539c1d23841175bc2' +
                      '2e565cdb0975bd690ecaeca2c39dfcf7';
      var payload = new Buffer('{ "a": \u1f60e }');

      expect(utils.isWebhookAuthentic('secret', payload, signature)).to.be(true);
    });

    it('throws a helpful message when called with wrong arity', function() {
      expect(utils.isWebhookAuthentic).withArgs('').to.throwException(/must be invoked with/);
    });

  });

});
