function checkEmptyPayload(req, res, next) {
  if (
    ['POST', 'PUT'].includes(req.method) &&
    req.headers['content-length'] === '0'
  ) {
    res.status(400);
    return res.json({ message: 'Payload should not be empty' });
  }
  return next();
}

export default checkEmptyPayload;
