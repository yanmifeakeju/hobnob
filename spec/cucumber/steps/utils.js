export function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();

  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'e@mail.com',
        password: 'password'
      };
    default:
      return undefined;
  }
}

export function convertStringToArray(string) {
  return string
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
}
