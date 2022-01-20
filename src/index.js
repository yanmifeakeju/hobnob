import express from 'express';
import elasticsearch from 'elasticsearch';
import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsJSON from './middlewares/check-content-type-is-json';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import errorHandler from './middlewares/error-handler';

const app = express();
const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

app.use(checkContentTypeIsSet);

app.use(checkContentTypeIsJSON);

app.use(checkEmptyPayload);

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

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API listening on ${process.env.SERVER_PORT}`);
});
