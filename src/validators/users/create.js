import ValidationError from '../errors/validation-error';

function validate(req) {
  if (!req.body.email || !req.body.password) {
    return new ValidationError(
      'Payload must contain at least the email and password fields'
    );
  }

  if (
    typeof req.body.email !== 'string' ||
    typeof req.body.password !== 'string'
  ) {
    return new ValidationError(
      'The email and password field must be type string'
    );
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError('The email field must be a valid email');
  }

  return null;
}

export default validate;
