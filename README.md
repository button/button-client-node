# button-client-node [![Build Status](https://travis-ci.org/button/button-client-node.svg?branch=master)](https://travis-ci.com/button/button-client-node)

This module is a thin client for interacting with Button's API.

Please see the full [API Docs](https://www.usebutton.com/developers/api-reference) for more information.  For help, check out our [Support](https://www.usebutton.com/support) page or [get in touch](https://www.usebutton.com/contact). 

#### Supported runtimes

* Node `0.10`, `0.11`, `0.12`, `4`, `5`, `6`

#### Dependencies

*  None

## Usage

```bash
npm install @button/button-client-node
```

To create a client capable of making network requests, invoke `button-client-node` with your [API key](https://app.usebutton.com/settings/organization). 

```javascript
var client = require('@button/button-client-node')('sk-XXX');
```

You can optionally supply a `config` argument with your API key:

```javascript
var Q = require('q');

var client = require('@button/button-client-node')('sk-XXX', {
  timeout: 3000, // network requests will time out at 3 seconds
  promise: function(resolver) { return Q.Promise(resolver); }
});
```

##### Config

* `timeout`: The time in ms for network requests to abort.  Defaults to false.
* `promise`: A function which accepts a resolver function and returns a promise.  Used to integrate with the promise library of your choice (i.e. es6 Promises, Bluebird, Q, etc).  If `promise` is supplied and is a function, all API functions will ignore any passed callbacks and instead return a promise. 
* `hostname`: Defaults to `api.usebutton.com`
* `port`: Defaults to `443` if `config.secure`, else defaults to `80`.
* `secure`: Whether or not to use HTTPS.  Defaults to true.  **N.B: Button's API is only exposed through HTTPS.  This option is provided purely as a convenience for testing and development.**


#### Node-style Callbacks

`button-client-node` supports standard node-style callbacks.  To make a standard call, supply a `callback` function as the last argument to any API function and omit `promise` from your `config`. 

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.orders.get('btnorder-XXX', function(err, res) {
  // ...
});
```

All callbacks will be invoked with two arguments.  `err` will be an `Error` object if an error occurred and `null` otherwise.  `res` will be the API response if the request succeeded or `null` otherwise.

#### Promise

`button-client-node` supports a promise interface.  To make a promise-based request, supply a function that accepts a single resolver function and returns a new promise on the `promise` key of your `config`. Additionally, you must omit the callback from your API function call. 

```javascript
var Promise = require('bluebird');
var client = require('@button/button-client-node')('sk-XXX', {
  promise: function(resolver) { return new Promise(resolver); }
});

client.orders.get('btnorder-XXX').then(function(result)  {
  // ...
}, function(reason) {
  // ...
});
```

A resolver function has the signature `function(resolve, reject) { ... }` and is supported by many promise implementations:

* [ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Bluebird](http://bluebirdjs.com/docs/api/new-promise.html)
* [Q](https://github.com/kriskowal/q/wiki/API-Reference#qpromiseresolver)
* [then](https://github.com/then/promise#new-promiseresolver)

If your promise library of choice doesn't support such a function, you can always roll your own as long as your library supports resolving and rejecting a promise you create: 

```javascript
promiseCreator(resolver) {
  var promise = SpecialPromise();
  
  resolver(function(result) {
    promise.resolve(result);
  }, function(reason) {
    promise.reject(reason);
  });
  
  return promise;
}
```

The returned promise will either reject with an `Error` or resolve with the API response object.

## Responses

All responses will assume the following shape: 

```javascript
{ 
  data,
  meta: {
    next,
    previous
  }
}
```

The `data` key will contain any resource data received from the API and the `meta` key will contain high-order information pertaining to the request.

##### meta

* `next`: For any paged resource, `next` will be a cursor to supply for the next page of results. 
* `previous`: For any paged resource, `previous` will be a cursor to supply for the previous page of results. 

## Resources

We currently expose two resource to manage, `Orders` and `Accounts`. 

### Orders

##### Create

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.orders.create({
  total: 50,
  currency: 'USD',
  order_id: '1989',
  btn_ref: 'srctok-XXX',
  finalization_date: '2017-08-02T19:26:08Z'
}, function(err, res) {
    // ...
});
```

##### Get

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.orders.get('btnorder-XXX', function(err, res) {
  // ...
});
```

##### Update

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.orders.update('btnorder-XXX', { total: 60 }, function(err, res) {
  // ...
});
```

##### Delete

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.orders.del('btnorder-XXX', function(err, res) {
  // ...
});
```

### Accounts

##### All

```javascript
var client = require('@button/button-client-node')('sk-XXX');

client.accounts.all(function(err, res) {
    // ...
});
```

##### Transactions

Transactions are a paged resource.  The response object will contain properties `meta.next` and `meta.previous` which can be supplied to subsequent invocations of `#transactions` to fetch additional results. 

`#transactions` accepts an optional second parameter, `options` which may define the follow keys to narrow results: 

###### options

* `cursor`: An API cursor to fetch a specific set of results
* `start`: An ISO-8601 datetime string to filter only transactions after `start`
* `end`: An ISO-8601 datetime string to filter only transactions before `end`

```javascript
var client = require('@button/button-client-node')('sk-XXX');

// without options argument
//
client.accounts.transactions('acc-1', function(err, res) {
    // ...
});
 
// with options argument
//
client.accounts.transactions('acc-1', {
  cursor: 'cXw',
  start: '2015-01-01T00:00:00Z',
  end: '2016-01-01T00:00:00Z'
}, function(err, res) {
    // ...
});
```

## Utils

Utils houses generic helpers useful in a Button Integration.

### #isWebhookAuthentic

Used to verify that requests sent to a webhook endpoint are from Button and that their payload can be trusted. Returns `true` if a webhook request body matches the sent signature and `false` otherwise. See [Webhook Security](https://www.usebutton.com/developers/webhooks/#security) for more details.

#### Example usage with [body-parser](https://www.npmjs.com/package/body-parser)

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var utils = require('@button/button-client-node').utils

var app = express();

function verify(req, res, buf, encoding) {
  return utils.isWebhookAuthentic(
    process.env['WEBHOOK_SECRET'],
    buf,
    req.headers['X-Button-Signature']
  );
}

app.use(bodyParser.json({ verify: verify, type: 'application/json' }));
```

## Contributing

* Installing development dependencies: `npm install`
* Running tests: `npm test`
* Running lint: `npm run lint`
