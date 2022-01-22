import Ajv from 'ajv';
import profileSchema from '../../schema/users/profile.json';
import createUserSchema from '../../schema/users/create.json';
import ValidationError from '../errors/validation-error';
import generateValidationErrorMessage from '../errors/messages';

function validate(req) {
  const ajvValidate = new Ajv()
    .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
    .addSchema([profileSchema, createUserSchema])
    .compile(createUserSchema);

  const valid = ajvValidate(req.body);

  if (!valid) {
    // Return Validation Error;
    return new ValidationError(
      generateValidationErrorMessage(ajvValidate.errors)
    );
  }

  return null;
}

export default validate;

// if (!req.body.email || !req.body.password) {
//   return new ValidationError(
//     'Payload must contain at least the email and password fields'
//   );
// }

// if (
//   typeof req.body.email !== 'string' ||
//   typeof req.body.password !== 'string'
// ) {
//   return new ValidationError(
//     'The email and password field must be type string'
//   );
// }

// if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
//   return new ValidationError('The email field must be a valid email');
// }

// return null;
// }
