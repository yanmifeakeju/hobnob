import assert from 'assert';
import generateValidationErrorMessage from '.';

describe('generateValidationErrorMessage', function () {
  it('should return the correct string when error.keyword is "required"', function () {
    const errors = [
      {
        keyword: 'required',
        message: 'must have required property'
      }
    ];

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = `The payload ${errors[0].message}`;

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  it('should retrun the correct string when error.keyword is "type"', function () {
    const errors = [
      {
        instancePath: '/password',
        schemaPath: '#/properties/password/type',
        keyword: 'type',
        params: { type: 'string' },
        message: 'must be string'
      }
    ];

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = `The '${errors[0].instancePath.replace(
      /\//g,
      '.'
    )}' field ${errors[0].message}`;

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  it('should return the correct string when error.keyword is "format"', function () {
    const errors = [
      {
        instancePath: '/email',
        schemaPath: '#/properties/email/format',
        keyword: 'format',
        params: { format: 'email' },
        message: 'must match format "email"'
      }
    ];

    const [error] = errors;

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = `The '${error.instancePath.replace(
      /\//g,
      '.'
    )}' field must be a valid ${error.params.format}`;

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });

  it('should return the correct string when error.keyword is "additionalProperties"', function () {
    const errors = [
      {
        instancePath: '/profile',
        schemaPath: 'profile.json/additionalProperties',
        keyword: 'additionalProperties',
        params: { additionalProperty: 'foo' },
        message: 'must NOT have additional properties'
      }
    ];

    const [error] = errors;

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = `The '${error.instancePath.replace(
      /\//g,
      '.'
    )}' object does not support the field '${error.params.additionalProperty}'`;

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "recognized"', function () {
    const errors = [
      {
        keyword: 'unavaliableKeyword'
      }
    ];

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = 'The object is not invalid';

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});
