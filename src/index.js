import { createServer } from 'http';

const requestHandler = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
};

const server = createServer(requestHandler);
server.listen(8000);
