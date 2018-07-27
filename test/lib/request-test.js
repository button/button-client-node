'use strict';

const expect = require('expect.js');
const nock = require('nock');
const request = require('lib').request;

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
    this.requestPromise = request(false, true);
  });

  it('makes a basic GET request', function() {
    const payload = { a: 2 };
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    this.scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.eql(payload);
      expect(res.meta).to.eql({ next: '1:', previous: '3:' });
      this.scope.done();
    });
  });

  it('makes a POST request', function() {
    const postData = { b: 3 };
    const payload = { a: 2 };
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    this.scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .post(path, postData)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return this.requestPromise({
      method: 'POST',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, postData).then((res) => {
      expect(res.data).to.eql(payload);
      this.scope.done();
    });
  });

  it('makes a DELETE request', function() {
    const payload = null;
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    this.scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .delete(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return this.requestPromise({
      method: 'DELETE',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.eql(payload);
      this.scope.done();
    });
  });


  it('handles server defined errors', function() {
    const error = 'bloop';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(404, errorResponse(error));

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal(error);
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(404);
      this.scope.done();
    });
  });

  it('handles unexpected errors', function() {
    const error = 'bloop';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .replyWithError(error);

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal(error);
      expect(err.response).to.be.an('undefined');
      this.scope.done();
    });
  });

  it('handles timeout errors', function() {
    const timeoutRequest = request(10, true);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .socketDelay(100)
      .reply(200, successResponse({}));

    return timeoutRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Request timed out');
      expect(err.response).to.be.an('undefined');
      this.scope.done();
    });
  });

  it('succeeds if faster than the timeout', function() {
    const payload = {};
    const timeoutRequest = request(1000, true);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .socketDelay(100)
      .reply(200, successResponse(payload));

    return timeoutRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }).then((res) => {
      expect(res.data).to.eql(payload);
      this.scope.done();
    });
  });

  it('handles invalid JSON errors', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, 'not json');

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Error parsing response as JSON: not json');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles empty responses', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, '');

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Client received an empty response from the server');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles unknown statuses', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Unknown status: ???');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles unknown statuses', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Unknown status: ???');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles response payloads without meta', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, {});

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles response payloads with an invalid meta', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: 'wat' });

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":"wat"}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles response payloads without an error', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' } });

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":{"status":"error"}}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles response payloads with an invalid error', function() {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' }, error: 'wat' });

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":{"status":"error"},"error":"wat"}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
      this.scope.done();
    });
  });

  it('handles invalid next / previous meta attributes', function() {
    const payload = {
      meta: {
        status: 'ok',
        next: 'https://api.usebutton.com/api/3',
        previous: 'https://api.usebutton.com/api/1'
      }
    };

    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    this.scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, payload);

    return this.requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.equal(undefined);
      expect(res.meta).to.eql({ next: null, previous: null });
      this.scope.done();
    });
  });

  it('makes insecure requests', function() {
    const insecureRequest = request(false, false);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    this.scope = nock('http://' + hostname + ':80')
      .get(path)
      .reply(200, successResponse({}));

    return insecureRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }).then((res) => {
      expect(res.data).to.eql({});
      this.scope.done();
    });
  });

});
