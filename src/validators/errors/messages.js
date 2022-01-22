function generateValidationErrorMessage(errors) {
  const error = errors[0];

  if (error.keyword === 'required') {
    return `The payload ${error.message}`;
  }

  if (error.keyword === 'type') {
    return `The '${error.instancePath.replace(/\//g, '.')}' field ${
      error.message
    }`;
  }

  if (error.keyword === 'format') {
    return `The '${error.instancePath.replace(
      /\//g,
      '.'
    )}' field must be a valid ${error.params.format}`;
  }

  if (error.keyword === 'additionalProperties') {
    return `The '${error.instancePath.replace(
      /\//g,
      '.'
    )}' object does not support the field '${error.params.additionalProperty}'`;
  }

  return 'The object is not invalid';
}

export default generateValidationErrorMessage;
