async function createUser(req, res, db) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      message: 'Payload must contain at least the email and password fields'
    });
    return;
  }

  if (
    typeof req.body.email !== 'string' ||
    typeof req.body.password !== 'string'
  ) {
    res.status(400).json({
      message: 'The email and password field must be type string'
    });
    return;
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    res.status(400).json({ message: 'The email field must be a valid email' });
    return;
  }

  try {
    const result = await db.index({
      index: 'hobnob',
      type: 'user',
      body: req.body
    });
    res.set('Content-Type', 'text/plain');

    res.status(201).send(result._id);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default createUser;
