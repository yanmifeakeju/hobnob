function checkContentTypeIsJSON(req, res, next) {
  if (
    req.headers['content-type'] &&
    !req.headers['content-type'].includes('application/json')
  ) {
    return res.status(415).json({
      message: 'The "Content-Type" header must always be "application/json"'
    });
  }
  return next();
}

export default checkContentTypeIsJSON;
