import create from '../../engines/users/create';
import ValidationError from '../../validators/errors/validation-error';

async function createUser(req, res, db) {
  try {
    const result = await create(req, db);
    console.log(result);
    res.status(201).set('Content-Type', 'text/plain').send(result._id);
    return;
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: 'Internal Server Errror' });
  }
}

export default createUser;

// create(req, db)
// .then((result) => {
//   res.status(201);
//   res.set('Content-Type', 'text/plain');
//   return res.send(result._id);
// })
// .catch((err) => {
//   if (err instanceof ValidationError) {
//     return res.status(400).json({ message: err.message });
//   }
//   return undefined;
// })
// .catch(() => res.status(500).json({ message: 'Internal Server Error' }));
