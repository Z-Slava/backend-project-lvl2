import _ from 'lodash';

const stylish = (diff) => {
  const iter = (currentDiff, keyPadding = 2, bracketPadding = 0) => {
    if (currentDiff.length < 1) {
      return '{}';
    }

    const result = currentDiff.reduce((acc, { key, value, sign }) => {
      const signedKey = `${sign} ${key}`;

      if (_.isObject(value)) {
        const nestedObject = iter(value, keyPadding + 4, bracketPadding + 4);
        return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${nestedObject}\n`;
      }

      return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${value}\n`;
    }, '');

    const wrapper = `{\n${result}${' '.repeat(bracketPadding)}}`;
    return wrapper;
  };

  return iter(diff);
};

export default stylish;
