var crypto = require('crypto');

module.exports = {
  isWebhookAuthentic: isWebhookAuthentic
};

function isWebhookAuthentic(webhookSecret, requestBody, sentSignature) {
  //
  // Used to verify that requests sent to a webhook endpoint are from Button
  // and that their payload can be trusted. Returns true if a webhook request
  // body matches the sent signature and false otherwise.
  //
  // ## Usage
  //
  // isWebhookAuthentic(
  //   process.env['WEBHOOK_SECRET'],
  //   buf,
  //   req.headers['X-Button-Signature']
  // );
  //
  // @param {String} webhookSecret your webhooks's secret key.  Find yours at
  //   https://app.usebutton.com/webhooks.
  // @param {String|Buffer} requestBody UTF8 encoded byte-string of the request
  //   body
  // @param {String} sentSignature "X-Button-Signature" HTTP Header sent with
  //   the request.
  // @returns {bool} whether or not the webhook request is authentic
  //
  if (arguments.length !== 3) {
    throw new Error('#isWebhookAuthentic must be invoked with (webhookSecret, requestBody, sentSignature)');
  }

  var computed_signature = crypto.createHmac('sha256', webhookSecret)
    .update(requestBody)
    .digest('hex');

  return computed_signature === sentSignature;
}
