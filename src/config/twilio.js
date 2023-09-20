const { accountSid, authToken } = require("./env-vars");

const client = require("twilio")(accountSid, authToken, {
  autoRetry: true,
  maxRetries: 3,
});

exports.TwilioClient = client;
