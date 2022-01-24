import assert from 'assert';
import generateValidationErrorMessage from '.';
import validate from '../users/create';

describe('generateValidationErrorMessage', function () {
  it('should return the correct string when error.keyword is "required"', function () {
    const errors = [
      {
        keyword: 'required',
        params: { missingProperty: 'testProperty' },
        message: "must have required property 'password'"
      }
    ];

    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = `The payload ${errors[0].message}`;

    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});
