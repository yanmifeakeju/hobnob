import express from 'express';

const app = express();

app.use((req, res, next) => {
  if (
    ['POST', 'PUT'].includes(req.method) &&
    req.headers['content-length'] === '0'
  ) {
    return res.status(400).json({ message: 'Payload should not be empty' });
  }
  return next();
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
  }
  next();
});

app.use(express.json());

app.post('/users', (req, res) => {
  res.status(200).send();
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

  console.log(req.headers['content-length']);

  next();
});

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API listening on ${process.env.SERVER_PORT}`);
});
