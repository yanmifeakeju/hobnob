import assert from 'assert';
import es from 'elasticsearch';
import ValidationError from '../../validators/errors/validation-error';
import createUserValidator from '../../validators/users/create';
import create from '.';

const db = new es.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTIC_SEARCH_PORT}`
});

describe('User Create Engine', () => {
  describe('When invoked with invalid req', () => {
    it('should return promise that rejects with an instance of ValidationError', () => {
      const req = {};
      // eslint-disable-next-line max-len
      create(req, db).catch((err) => assert(err instanceof ValidationError));
    });
  });
});

describe('When invoked with valid req', () => {
  it('should return a sucess object containing the user ID', () => {
    const req = {
      body: {
        email: 'e@mail.com',
        password: 'password',
        profile: {}
      }
    };
    create(req, db).then((result) => {
      assert.equal(result.result, 'created');
      assert.equal(typeof result._id, 'string');
    });
  });
});
