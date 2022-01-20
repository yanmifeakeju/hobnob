function injectHandlerDependecies(handler, db) {
  return (req, res) => {
    handler(req, res, db);
  };
}

export default injectHandlerDependecies;
