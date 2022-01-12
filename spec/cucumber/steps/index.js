import superagent from 'superagent';
import elasticsearch from 'elasticsearch';
import { Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import { convertStringToArray, getValidPayload } from './utils';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});
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

When(
  /^attaches an? (.+) payload which is missing the ([a-zA-Z0-9]+) fields?$/,
  function (payloadType, missingFields) {
    const payload = {
      email: 'e@mail.com',
      password: 'password'
    };
    const fieldsToDelete = missingFields
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    fieldsToDelete.forEach((field) => delete payload[field]);

    this.request
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload));
  }
);

When(
  /attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not) a ([a-zA-Z0-9]+)$/,
  function (payloadType, fields, invert, type) {
    this.requestPayload = getValidPayload(payloadType);
    const fieldsToModify = convertStringToArray(fields);

    const typeKey = type.toLowerCase();
    const invertKey = invert ? 'not' : 'is';
    const sampleValues = {
      string: {
        is: 'string',
        not: 10
      }
    };

    fieldsToModify.forEach((field) => {
      this.requestPayload[field] = sampleValues[typeKey][invertKey];
    });

    this.request
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(this.requestPayload));
  }
);

When(
  /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/,
  function (payloadType, fields, value) {
    this.requestPayload = getValidPayload(payloadType);

    const fieldsToModify = convertStringToArray(fields);
    fieldsToModify.forEach((field) => {
      this.requestPayload[field] = value;
    });

    this.request
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(this.requestPayload));
  }
);

When(/^attaches a valid (.+) payload/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.requestPayload.email = 'kez@mail.com';
  this.request
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(this.requestPayload));
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

Then(
  /^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/,
  function (payloadType) {
    const contentType =
      this.response.headers['Content-Type'] ||
      this.response.headers['content-type'];

    if (payloadType === 'JSON object') {
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not of Content-Type application/json');
      }
      try {
        this.responsePayload = JSON.parse(this.response.text);
      } catch (err) {
        throw new Error('Response not a valid JSON Object');
      }
    }

    if (payloadType === 'string') {
      if (!contentType || !contentType.includes('text/plain')) {
        throw new Error('Response not of Content-Type text/plain');
      }

      this.responsePayload = this.response.text;
      if (typeof this.responsePayload !== 'string') {
        throw new Error('Response is  not a string');
      }
    }
  }
);

Then(
  /^contains a message property which says (?:"|')(.*)(?:"|')$/,
  async function (message) {
    assert.equal(this.responsePayload.message, message);
  }
);

Then(
  /^the payload object should be added to the database under the "([a-zA-Z]+)" type$/,
  async function (type) {
    this.type = type;
    const result = await client.get({
      index: 'hobnob',
      type: this.type,
      id: this.responsePayload
    });
    assert.deepEqual(result._source, this.requestPayload);
  }
);

Then('the  newly-created user should be deleted', async function () {
  const result = await client.delete({
    index: 'hobnob',
    type: this.type,
    id: this.responsePayload
  });
  assert.equal(result.result, 'deleted');
});
