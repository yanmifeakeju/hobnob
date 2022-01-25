function checkContentTypeIsSet(req, res, next) {
  if (
    Number(req.headers['content-length']) > 0 &&
    (!req.headers || !req.headers['content-type'])
  ) {
    res.status(400);
    return res.json({
      message:
        'The "Content-Type" header must be set for request with a non-empty payload'
    });
  }

  return next();
}

export default checkContentTypeIsSet;
