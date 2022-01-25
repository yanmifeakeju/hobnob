function checkContentTypeIsSet(req, res, next) {
  if (!req.headers['content-type'] && req.headers['content-length'] !== 0) {
    res.status(400).json({
      message:
        'The  "Content-Type" header must be set for request with a non-empty payload'
    });
    return;
  }
  next();
}

export default checkContentTypeIsSet;
