import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/users/create';

function create(req, db) {
  const validationResults = validate(req);

  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }

  // const result = { _id: 'it does not work' };

  // return Promise.resolve(result);

  console.log(process.env.ELASTICSEARCH_INDEX);
  return db
    .index({
      index: process.env.ELASTICSEARCH_INDEX,
      type: 'user',
      body: req.body
    })
    .then((result) => Promise.resolve(result))
    .catch((e) => {
      console.log(e);
      return Promise.reject(e);
    });
}

export default create;
