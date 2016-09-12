'use strict';

var expect = require('expect.js');
var nock = require('nock');

var request = require('lib').request;

function errorResponse(message) {
  return {
    meta: { status: 'error' },
    error: { message: message }
  };
}

function successResponse(obj) {
  return {
    meta: {
      status: 'ok',
      next: 'https://api.usebutton.com/api?cursor=1%3A',
      previous: 'https://api.usebutton.com/api?cursor=3%3A'
    },
    object: obj
  };
}

describe('lib/#request', function() {

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  beforeEach(function() {
    this.request = request(false, true);
  });

  it('makes a basic GET request', function(done) {
    var payload = { a: 2 };
    var contentType = 'application/json';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';
    var user = 'sk-XXX';

    var scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql(payload);
      expect(res.meta).to.eql({ next: '1:', previous: '3:' });
      scope.done();
      done();
    });
  });

  it('makes a POST request', function(done) {
    var postData = { b: 3 };
    var payload = { a: 2 };
    var contentType = 'application/json';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';
    var user = 'sk-XXX';

    var scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .post(path, postData)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    this.request({
      method: 'POST',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, postData, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql(payload);
      scope.done();
      done();
    });
  });

  it('makes a DELETE request', function(done) {
    var payload = null;
    var contentType = 'application/json';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';
    var user = 'sk-XXX';

    var scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .delete(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    this.request({
      method: 'DELETE',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql(payload);
      scope.done();
      done();
    });
  });


  it('handles server defined errors', function(done) {
    var error = 'bloop';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(404, errorResponse(error));

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be(error);
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles unexpected errors', function(done) {
    var error = 'bloop';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .replyWithError(error);

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be(error);
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles timeout errors', function(done) {
    var timeoutRequest = request(10, true);
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .socketDelay(100)
      .reply(200, successResponse({}));

    timeoutRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Request timed out');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('succeeds if faster than the timeout', function(done) {
    var payload = {};
    var timeoutRequest = request(1000, true);
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .socketDelay(100)
      .reply(200, successResponse(payload));

    timeoutRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql(payload);
      scope.done();
      done();
    });
  });

  it('handles invalid JSON errors', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, 'not json');

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Error parsing response as JSON: not json');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles empty responses', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, '');

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Client received an empty response from the server');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles unknown statuses', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Unknown status: ???');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles unknown statuses', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Unknown status: ???');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles response payloads without meta', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, {});

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Invalid response: {}');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles response payloads with an invalid meta', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: 'wat' });

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Invalid response: {"meta":"wat"}');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles response payloads without an error', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' } });

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Invalid response: {"meta":{"status":"error"}}');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles response payloads with an invalid error', function(done) {
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' }, error: 'wat' });

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err.message).to.be('Invalid response: {"meta":{"status":"error"},"error":"wat"}');
      expect(res).to.eql(null);
      scope.done();
      done();
    });
  });

  it('handles invalid next / previous meta attributes', function(done) {
    var payload = {
      meta: {
        status: 'ok',
        next: 'https://api.usebutton.com/api/3',
        previous: 'https://api.usebutton.com/api/1'
      }
    };

    var contentType = 'application/json';
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';
    var user = 'sk-XXX';

    var scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, payload);

    this.request({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql(undefined);
      expect(res.meta).to.eql({ next: null, previous: null });
      scope.done();
      done();
    });
  });

  it('makes insecure requests', function(done) {
    var insecureRequest = request(false, false);
    var path = '/bleep/bloop';
    var hostname = 'api.usebutton.com';

    var scope = nock('http://' + hostname + ':80')
      .get(path)
      .reply(200, successResponse({}));

    insecureRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }, function(err, res) {
      expect(err).to.be(null);
      expect(res.data).to.eql({});
      scope.done();
      done();
    });
  });

});
