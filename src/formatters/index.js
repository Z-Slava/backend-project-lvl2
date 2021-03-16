import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (formatName) => {
  if (formatName === 'stylish') {
    return stylish;
  }
  if (formatName === 'plain') {
    return plain;
  }
  if (formatName === 'json') {
    return json;
  }

  throw Error(`Formatter ${formatName} is not supported`);
};
