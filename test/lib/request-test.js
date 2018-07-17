'use strict';

const expect = require('chai').expect;
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
  let scope;
  let requestPromise;

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    requestPromise = request(false, true);
  });

  afterEach(() => scope.done());

  it('makes a basic GET request', () => {
    const payload = { a: 2 };
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.deep.equal(payload);
      expect(res.meta).to.deep.equal({ next: '1:', previous: '3:' });
    });
  });

  it('makes a POST request', () => {
    const postData = { b: 3 };
    const payload = { a: 2 };
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .post(path, postData)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return requestPromise({
      method: 'POST',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }, postData).then((res) => {
      expect(res.data).to.eql(payload);
    });
  });

  it('makes a DELETE request', () => {
    const payload = null;
    const contentType = 'application/json';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';
    const user = 'sk-XXX';

    scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .delete(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, successResponse(payload));

    return requestPromise({
      method: 'DELETE',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.eql(payload);
    });
  });


  it('handles server defined errors', () => {
    const error = 'bloop';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(404, errorResponse(error));

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal(error);
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(404);
    });
  });

  it('handles unexpected errors', () => {
    const error = 'bloop';
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .replyWithError(error);

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal(error);
      expect(err.response).to.be.an('undefined');
    });
  });

  it('handles timeout errors', () => {
    const timeoutRequest = request(10, true);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
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
    });
  });

  it('succeeds if faster than the timeout', () => {
    const payload = {};
    const timeoutRequest = request(1000, true);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .socketDelay(100)
      .reply(200, successResponse(payload));

    return timeoutRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }).then((res) => {
      expect(res.data).to.deep.equal(payload);
    });
  });

  it('handles invalid JSON errors', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, 'not json');

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Error parsing response as JSON: not json');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles empty responses', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, '');

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Client received an empty response from the server');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles unknown statuses', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Unknown status: ???');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles unknown statuses', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: '???' } });

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Unknown status: ???');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles response payloads without meta', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, {});

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles response payloads with an invalid meta', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: 'wat' });

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":"wat"}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles response payloads without an error', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' } });

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":{"status":"error"}}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles response payloads with an invalid error', () => {
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('https://' + hostname + ':443')
      .get(path)
      .reply(200, { meta: { status: 'error' }, error: 'wat' });

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname
    }).catch((err) => {
      expect(err.message).to.equal('Invalid response: {"meta":{"status":"error"},"error":"wat"}');
      expect(err.response).to.be.an('object');
      expect(err.response.statusCode).to.equal(200);
    });
  });

  it('handles invalid next / previous meta attributes', () => {
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

    scope = nock('https://' + hostname + ':443', { reqheaders: { 'content-type': contentType } })
      .get(path)
      .basicAuth({ user: user, pass: '' })
      .reply(200, payload);

    return requestPromise({
      method: 'GET',
      path: path,
      hostname: hostname,
      auth: user + ':',
      headers: { 'Content-Type': contentType }
    }).then((res) => {
      expect(res.data).to.equal(undefined);
      expect(res.meta).to.deep.equal({ next: null, previous: null });
    });
  });

  it('makes insecure requests', () => {
    const insecureRequest = request(false, false);
    const path = '/bleep/bloop';
    const hostname = 'api.usebutton.com';

    scope = nock('http://' + hostname + ':80')
      .get(path)
      .reply(200, successResponse({}));

    return insecureRequest({
      method: 'GET',
      path: path,
      hostname: hostname
    }).then((res) => {
      expect(res.data).to.deep.equal({});
    });
  });

});
