import express from 'express';

const app = express();
app.use(express.json());

app.post('/users', (req, res) => {
  if (req.headers['content-length'] === '0') {
    res.status(400).json({ message: 'Payload should not be empty' });
    return;
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(415).json({
      message: 'The "Content-Type" header must always be "application/json"'
    });
    return;
  }

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
  }

  next();
});

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API listening on ${process.env.SERVER_PORT}`);
});
