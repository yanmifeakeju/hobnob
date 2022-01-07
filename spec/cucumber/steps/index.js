import superagent from 'superagent';
import { Then, When } from '@cucumber/cucumber';
import assert from 'assert';

When('the client creates a POST request to users', async function () {
  this.request = superagent(
    'POST',
    `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`
  );
});

When('attaches a generic empty payload', async function () {
  return undefined;
});

When('sends the request', async function () {
  try {
    const response = await this.request;
    this.response = response.res;
  } catch (err) {
    this.response = err.response;
  }
});

Then('our API should respond with a 400 HTTP status code', async function () {
  assert.equal(this.response.statusCode, 400);
});

Then('the payload of the response shoud be a JSON object', function () {
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
  'contains a message property which say "Payload should not be empty"',
  function () {
    assert.equal(this.responsePayload.message, 'Payload should not be empty');
  }
);
