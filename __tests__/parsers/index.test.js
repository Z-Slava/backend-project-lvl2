import _ from 'lodash';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync } from 'fs';
import getParsedFile from '../../src/parsers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const nestedJson = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
      doge: {
        wow: '',
      },
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
    deep: {
      id: 45,
    },
  },
  group4: 'string',
};

describe('Test getParsedFile function', () => {
  test('Should return json from not empty json file', () => {
    const expected = _.cloneDeep(nestedJson);
    const fileName = 'nested1.json';
    const file = readFile(fileName);
    const ext = extname(fileName);

    const resultJson = getParsedFile(file, { ext });

    expect(resultJson).toEqual(expected);
  });

  test('Should return json from not empty yaml file', () => {
    const expected = _.cloneDeep(nestedJson);
    const fileName = 'nested1.yaml';
    const file = readFile(fileName);
    const ext = extname(fileName);

    const resultJson = getParsedFile(file, { ext });

    expect(resultJson).toEqual(expected);
  });

  test('Should throw error for not supported extenstion', () => {
    const fileName = 'nested-diff.txt';
    const file = readFile(fileName);
    const extention = extname(fileName);

    expect(() => getParsedFile(file, extention)).toThrow();
  });

  test('Should return json by default', () => {
    const expected = _.cloneDeep(nestedJson);
    const file = readFile('nested1.json');

    const resultJson = getParsedFile(file);

    expect(resultJson).toEqual(expected);
  });
});
