import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');
const readFileAsString = (filename) => readFile(filename).toString('utf-8');

describe('Test genDiff function', () => {
  describe('Test for nested structures', () => {
    test('Should return valid diff when calling with stylish formatter', () => {
      const filepath1 = getFixturePath('nested1.json');
      const filepath2 = getFixturePath('nested2.json');
      const expected = readFileAsString('nested-diff.txt');

      const actual = genDiff(filepath1, filepath2, 'stylish');

      expect(actual).toBe(expected);
    });

    test('Should return valid diff when calling with plain formatter', () => {
      const filepath1 = getFixturePath('nested1.yaml');
      const filepath2 = getFixturePath('nested2.json');
      const expected = readFileAsString('plain.txt');

      const actual = genDiff(filepath1, filepath2, 'plain');

      expect(actual).toBe(expected);
    });

    test('Should return valid json when calling with json formatter', () => {
      const filepath1 = getFixturePath('nested1.yaml');
      const filepath2 = getFixturePath('nested2.yaml');

      const data = genDiff(filepath1, filepath2, 'json');

      expect(() => JSON.parse(data)).not.toThrow();
    });

    test('Should return valid json when calling with empty jsons files', () => {
      const relativeFilePath = '__fixtures__/empty.json';
      const filepath2 = getFixturePath('empty.json');
      const expected = '{}';

      const actual = genDiff(relativeFilePath, filepath2);

      expect(actual).toEqual(expected);
    });

    test('Should throw error for not supported formatters', () => {
      const filepath1 = getFixturePath('nested1.json');
      const filepath2 = getFixturePath('nested2.json');

      const actual = () => genDiff(filepath1, filepath2, 'blabla');

      expect(actual).toThrow();
    });
  });
});
