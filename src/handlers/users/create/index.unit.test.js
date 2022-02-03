import { stub } from 'sinon';

import ValidationError from '../../../validators/errors/validation-error';

// eslint-disable-next-line no-unused-vars
const createStubs = {
  success: stub().resolves({ _id: 'foo' }),
  ValidationError: stub().rejects(new ValidationError()),
  otherError: stub().rejects(new Error())
};
