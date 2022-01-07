import superagent from 'superagent';
import { Then, When } from '@cucumber/cucumber';

let request;
let result;
let error;

When('the client creates a POST request to users', async function () {
  request = superagent('POST', 'localhost:8000/userss');
});

When('attaches a generic empty payload', async function () {
  return undefined;
});

When('sends the request', async function () {
  try {
    const response = await request;
    result = response.res;
  } catch (err) {
    error = err.response;
  }
});

Then('our API should respond with a 400 HTTP status code', async function () {
  if (error.statusCode !== 400) {
    throw new Error();
  }
});

Then('the payload of the response shoud be a JSON object', function (callback) {
  callback(null, 'pending');
});

Then(
  'contains a message property which say "Payload should not be empty"',
  function (callback) {
    callback(null, 'pending');
  }
);
