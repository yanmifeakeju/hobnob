import superagent from 'superagent';
import elasticsearch from 'elasticsearch';
import { Then, When } from '@cucumber/cucumber';
import assert from 'assert';

const client = new elasticsearch.Client(
  `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:$${process.env.ELASTICSEARCH_PORT}`
);

When(
  /^the client creates a (GET|POST|PUT|DELETE) request to ([/\w-:]+)$/,
  async function (method, path) {
    this.request = superagent(
      method,
      `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${path}`
    );
  }
);

When(/attaches a generic (.+) payload$/, async function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request.set('Content-Type', 'application/json');
      this.request.send('{"email": "kez@akeju.com", "name":}');
      break;
    case 'non-JSON':
      this.request.set('Content-Type', 'text/xml');
      this.request.send(
        '<?xml version="1.0" encodoing="UTF-8"?><email>kez@akeju.com</email>'
      );
      break;
    case 'empty':
      this.request.set('Content-Type', 'application/json');
      break;
    default:
      break;
  }
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

When('sends the request', async function () {
  try {
    const response = await this.request;
    this.response = response.res;
  } catch (err) {
    this.response = err.response;
  }
});

Then(
  /our API should respond with a ([1-5]\d{2}) HTTP status code/,
  async function (statusCode) {
    assert.equal(this.response.statusCode, statusCode);
  }
);

Then('the payload of the response should be a JSON object', function () {
  const contentType =
    this.response.headers['Content-Type'] ||
    this.response.headers['content-type'];

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type application/json');
  }
  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (err) {
    throw new Error('Response not a valid JSON Object');
  }
});

Then(
  /^contains a message property which says (?:"|')(.*)(?:"|')$/,
  async function (message) {
    assert.equal(this.responsePayload.message, message);
  }
);
