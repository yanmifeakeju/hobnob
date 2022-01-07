import { createServer } from 'http';

const requestHandler = (req, res) => {
  if (req.method === 'POST' && req.url === '/users') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Payload should not be empty' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
};

const server = createServer(requestHandler);
server.listen(8000);
