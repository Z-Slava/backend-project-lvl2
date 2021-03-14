import _ from 'lodash'

const stylish = (diff, keyPadding = 2, bracketPadding = 0) => {
  if (diff.length < 1) {
    return '{}';
  }

  const result = diff.reduce((acc, { key, value, sign }) => {
    const signedKey = `${sign} ${key}`;

    if (_.isObject(value)) {
      const nestedObject = stylish(value, keyPadding + 4, bracketPadding + 4);
      return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${nestedObject}\n`;
    }

    return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${value}\n`;
  }, '');

  const wrapper = `{\n${result}${' '.repeat(bracketPadding)}}`;

  return wrapper;
};

export default stylish;
