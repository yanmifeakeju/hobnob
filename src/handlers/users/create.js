import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/users/create';

async function createUser(req, res, db) {
  try {
    const validationResults = validate(req);

    if (validationResults instanceof ValidationError) {
      res.status(400).json({ message: validationResults.message });
      return;
    }
    const result = await db.index({
      index: 'hobnob',
      type: 'user',
      body: req.body
    });

    res.set('Content-Type', 'text/plain');
    res.status(201).send(result._id);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default createUser;
