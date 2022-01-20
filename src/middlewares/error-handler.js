function errorHandler(err, req, res, next) {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err &&
    err.type === 'entity.parse.failed'
  ) {
    res.status(400).json({ message: 'Malformed JSON in request body' });
    return;
  }

  next();
}

export default errorHandler;
