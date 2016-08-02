'use strict';

var expect = require('expect.js');
var Q = require('q');
var Bluebird = require('bluebird');

var maybePromise = require('lib').maybePromise;

describe('lib/#maybePromise', function() {

  beforeEach(function() {
    this.f = function(arg1, arg2, callback) {
      setTimeout(function() {
        callback(arg1, arg2);
      }, 10);
    };
  });

  it('treats the result transparently if no valid promise generator is passed', function(done) {
    var maybe = maybePromise(this.f);

    maybe(null, 2, function(arg1, arg2) {
      expect(arg1).to.be(null);
      expect(arg2).to.be(2);
      done();
    });
  });

  it('treats the result as a promise generator if a valid generator is passed', function(done) {
    var maybe = maybePromise(this.f, function(resolver) { return Q.Promise(resolver); });

    maybe(null, 2, undefined).then(function(result) {
      expect(result).to.be(2);
      done();
    });
  });

  it('rejects the promise if the first value in the callback is truthy', function(done) {
    var maybe = maybePromise(this.f, function(resolver) { return Q.Promise(resolver); });

    maybe(new Error('bloop'), 2, undefined).catch(function(reason) {
      expect(reason.message).to.eql('bloop');
      done();
    });
  });

  it('accommodates arbitrary promise implementations', function(done) {
    var maybe = maybePromise(this.f, function(resolver) { return new Bluebird(resolver); });

    maybe(null, 2, undefined).then(function(result) {
      expect(result).to.be(2);
      done();
    });
  });

});
