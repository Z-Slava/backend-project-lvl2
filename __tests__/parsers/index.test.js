import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync } from 'fs';
import getParsedFile from '../../src/parsers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

describe('Test getParsedFile function', () => {
  test('Should return json from not empty json file', () => {
    const expected = {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    };
    const file = readFile('hexlet1.json');
    const ext = extname('hexlet1.json');

    const resultJson = getParsedFile(file, { ext });

    expect(resultJson).toEqual(expected);
  });

  test('Should return json from not empty yaml file', () => {
    const expected = {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    };
    const file = readFile('hexlet1.yaml');
    const ext = extname('hexlet1.yaml');

    const resultJson = getParsedFile(file, { ext });

    expect(resultJson).toEqual(expected);
  });

  test('Should throw error for not supported extenstion', () => {
    const file = readFile('hexlet-diff.txt');
    const extention = extname('hexlet-diff.txt');

    expect(() => getParsedFile(file, extention)).toThrow();
  });

  test('Should return json by default', () => {
    const expected = {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    };
    const file = readFile('hexlet1.json');

    const resultJson = getParsedFile(file);

    expect(resultJson).toEqual(expected);
  });
});
