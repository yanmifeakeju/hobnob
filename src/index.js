import express from 'express';
import elasticsearch from 'elasticsearch';

const app = express();
const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

app.use((req, res, next) => {
  if (
    ['POST', 'PUT'].includes(req.method) &&
    req.headers['content-length'] === '0'
  ) {
    res.status(400).json({ message: 'Payload should not be empty' });
    return;
  }
  next();
});

app.use((req, res, next) => {
  if (
    req.headers['content-type'] &&
    !req.headers['content-type'].includes('application/json')
  ) {
    return res.status(415).json({
      message: 'The "Content-Type" header must always be "application/json"'
    });
  }
  return next();
});

app.use((req, res, next) => {
  if (!req.headers['content-type'] && req.headers['content-length'] !== 0) {
    res.status(400).json({
      message:
        'The  "Content-Type" header must be set for request with a non-empty payload'
    });
    return;
  }
  next();
});

app.use(express.json());

app.post('/users', async (req, res) => {
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
    const result = await client.index({
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
});

app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err &&
    err.type === 'entity.parse.failed'
  ) {
    res.status(400).json({ message: 'Malformed JSON in request body' });
    return;
  }

  next();
});

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API listening on ${process.env.SERVER_PORT}`);
});
