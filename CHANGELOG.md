Current Version
 -

2.6.0 July 18, 2017
  - Add `customers` resource
    + `customers#create`
    + `customers#get`

2.5.0 June 23, 2017
  - Add apiVersion to client config

2.4.0 June 12, 2017
  - Request errors now include the `response` object.

2.3.0 January 6, 2017
  - Add `merchants` resource
    + `merchants#all`

2.2.0 January 4, 2017
  - Add `client.utils.isWebhookAuthentic` function

2.1.1 October 12, 2016
  - Renamed package to `@button/button-client-node`

2.1.0 September 12, 2016
  - Added config.hostname, config.port, and config.secure

2.0.0 August 24, 2016
  - Added `accounts` resource
      + `accounts#all`
      + `accounts#transactions`
  - Changed response structure.  All responses are now an object with two attributes: `data` containing what was previously the entire response and `meta` containing additional properties about a request.

1.0.0 August 5, 2016
  - Initial Release
