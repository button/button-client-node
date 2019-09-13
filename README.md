# button-client-node [![Build Status](https://travis-ci.org/button/button-client-node.svg?branch=master)](https://travis-ci.org/button/button-client-node)

This module is a thin client for interacting with Button's API.

Please see the full [API Docs](https://www.usebutton.com/developers/api-reference) for more information.  For help, check out our [Support](https://www.usebutton.com/support) page or [get in touch](https://www.usebutton.com/contact).

#### Supported runtimes

* Node `6`, `8`, `10`

#### Dependencies

*  None

## Usage

```bash
npm install @button/button-client-node
```

To create a client capable of making network requests, invoke `button-client-node` with your [API key](https://app.usebutton.com/settings/organization).

```javascript
const client = require('@button/button-client-node')('sk-XXX');
```

You can optionally supply a `config` argument with your API key:

```javascript
const client = require('@button/button-client-node')('sk-XXX', {
  timeout: 3000, // network requests will time out at 3 seconds
  hostname: 'api.usebutton.com' // default hostname for api requests
});
```

##### Config

* `timeout`: The time in ms for network requests to abort.  Defaults to false.
* `hostname`: Defaults to `api.usebutton.com`
* `port`: Defaults to `443` if `config.secure`, else defaults to `80`.
* `secure`: Whether or not to use HTTPS.  Defaults to true.  **N.B: Button's API is only exposed through HTTPS.  This option is provided purely as a convenience for testing and development.**

#### Promise

`button-client-node` uses native Promises for all requests:

```javascript
const client = require('@button/button-client-node')('sk-XXX', {
  timeout: 3000
});

client.orders.get('btnorder-XXX')
  .then(handleResult)
  .catch(handleError);
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

We currently expose the following resources to manage:

* [`Accounts`](#accounts)
* [`Merchants`](#merchants)
* [`Orders`](#orders)
* [`Transactions`](#transactions)

### Accounts

##### All

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.accounts.all()
  .then(handleResult)
  .catch(handleError);
```

##### Transactions

Transactions are a paged resource.  The response object will contain properties `meta.next` and `meta.previous` which can be supplied to subsequent invocations of `#transactions` to fetch additional results.

`#transactions` accepts an optional second parameter, `options` which may define the follow keys to narrow results:

###### options

* `cursor`: An API cursor to fetch a specific set of results
* `start`: An ISO-8601 datetime string to filter only transactions after `start`
* `end`: An ISO-8601 datetime string to filter only transactions before `end`
* `time_field`: Which time field start and end filter on.

```javascript
const client = require('@button/button-client-node')('sk-XXX');

// without options argument
//
client.accounts.transactions('acc-1')
  .then(handleSuccess)
  .catch(handleError);

// with options argument
//
client.accounts.transactions('acc-1', {
  cursor: 'cXw',
  start: '2015-01-01T00:00:00Z',
  end: '2016-01-01T00:00:00Z',
  time_field: 'modified_date'
}).then(handleResult)
  .catch(handleError);
```

### Merchants

##### All

###### options

* `status`: Partnership status to filter by. One of ('approved', 'pending', or 'available')
* `currency`: ISO-4217 currency code to filter returned rates by

```javascript
const client = require('@button/button-client-node')('sk-XXX');

// without options argument
//
client.merchants.all()
  .then()
  .catch();

// with options argument
//
client.merchants.all({
  status: 'pending',
  currency: 'USD'
}).then(handleResult)
  .catch(handleError);
```

### Orders

##### Create

```javascript
const crypto = require('crypto');
const client = require('@button/button-client-node')('sk-XXX');

const hashedEmail = crypto.createHash('sha256')
  .update('user@example.com'.toLowerCase().trim())
  .digest('hex');

client.orders.create({
  total: 50,
  currency: 'USD',
  order_id: '1989',
  purchase_date: '2017-07-25T08:23:52Z',
  finalization_date: '2017-08-02T19:26:08Z',
  btn_ref: 'srctok-XXX',
  customer: {
    id: 'mycustomer-1234',
    email_sha256: hashedEmail
  }
}).then(handleResult)
  .catch(handleError);
```

##### Get

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.orders.get('btnorder-XXX')
  .then(handleResult)
  .catch(handleError);
```

##### Get by Button Ref

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.orders.getByBtnRef('srctok-XXX')
  .then(handleResult)
  .catch(handleError);
```

##### Update

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.orders.update('btnorder-XXX', { total: 60 })
  .then(handleResult)
  .catch(handleError);
```

##### Delete

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.orders.del('btnorder-XXX')
  .then(handleResult)
  .catch(handleError);
```

### Customers

##### Create

```javascript
const crypto = require('crypto');
const client = require('@button/button-client-node')('sk-XXX');

const hashedEmail = crypto.createHash('sha256')
  .update('user@example.com'.toLowerCase().trim())
  .digest('hex');

client.customers.create({
  id: 'customer-1234',
  email_sha256: hashedEmail
}).then(handleResult)
  .catch(handleError);
```

##### Get

```javascript
const client = require('@button/button-client-node')('sk-XXX');

client.customers.get('customer-1234')
  .then(handleResult)
  .catch(handleError);
```

### Links

##### Create

```javascript
client.links.create({
  url: "https://www.jet.com",
  experience: {
    btn_pub_ref: "my-pub-ref",
    btn_pub_user: "user-id"
  }
}).then(handleResult)
  .catch(handleError);
```

##### Get Info

```javascript
client.links.getInfo({ url: "https://www.jet.com" })
  .then(handleSuccess)
  .catch(handleError);
```

### Transactions


##### All
Transactions are a paged resource.  The response object will contain properties `meta.next` and `meta.previous` which can be supplied to subsequent invocations of `#all` to fetch additional results.

`#all` accepts an optional second parameter, `options` which may define the follow keys to narrow results:

Unlike the accounts.transaction resource, which only queries a single account's transactions, the transactions.all resource queries all of an organizations transactions.

###### options

* `cursor`: An API cursor to fetch a specific set of results
* `start`: An ISO-8601 datetime string to filter only transactions after `start`
* `end`: An ISO-8601 datetime string to filter only transactions before `end`
* `time_field`: Which time field start and end filter on.

```javascript
const client = require('@button/button-client-node')('sk-XXX');

// without options argument
//
client.transactions.all()
  .then(handleSuccess)
  .catch(handleError);

// with options argument
//
client.transactions.all({
  cursor: 'cXw',
  start: '2015-01-01T00:00:00Z',
  end: '2016-01-01T00:00:00Z',
  time_field: 'modified_date'
}).then(handleResult)
  .catch(handleError);
```


## Utils

Utils houses generic helpers useful in a Button Integration.

### #isWebhookAuthentic

Used to verify that requests sent to a webhook endpoint are from Button and that their payload can be trusted. Returns `true` if a webhook request body matches the sent signature and `false` otherwise. See [Webhook Security](https://www.usebutton.com/developers/webhooks/#security) for more details.

#### Example usage with [body-parser](https://www.npmjs.com/package/body-parser)

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const utils = require('@button/button-client-node').utils

const app = express();

function verify(req, res, buf, encoding) {
  const isAuthentic = utils.isWebhookAuthentic(
    process.env['WEBHOOK_SECRET'],
    buf,
    req.headers['X-Button-Signature']
  );

  if (!isAuthentic) {
    throw new Error('Invalid Webhook Signature');
  }
}

app.use(bodyParser.json({ verify: verify, type: 'application/json' }));
```

## Contributing

* Installing development dependencies: `npm install`
* Running tests: `npm test`
* Running lint: `npm run lint`
