import express from 'express';
import elasticsearch from 'elasticsearch';
import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsJSON from './middlewares/check-content-type-is-json';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import errorHandler from './middlewares/error-handler';
import createUser from './handlers/users/create';
import injectHandlerDependecies from './utils/injectHandlerDependecies';

const app = express();
const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

app.use(express.json());

app.use(checkContentTypeIsSet);

app.use(checkContentTypeIsJSON);

app.use(checkEmptyPayload);

app.use(express.json());

app.post('/users', injectHandlerDependecies(createUser, client));

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API listening on ${process.env.SERVER_PORT}`);
});
