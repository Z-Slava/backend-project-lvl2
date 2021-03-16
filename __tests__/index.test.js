import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');
const readFileAsString = (filename) => readFile(filename).toString('utf-8');
const readFileAsJson = (filename) => JSON.parse(readFile(filename));

const flatJson1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const flatJson2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const emptyJson = {};

describe('Test genDiff function', () => {
  describe('Tests for flat stractures', () => {
    test('Should return valid diff when passing 2 not empty jsons', () => {
      const expected = readFileAsString('flat-diff.txt');

      const resultDiff = genDiff(flatJson1, flatJson2);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing empty first json', () => {
      const expected = readFileAsString('flat-diff-empty-source.txt');

      const resultDiff = genDiff(emptyJson, flatJson2);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing empty second json', () => {
      const expected = readFileAsString('flat-diff-empty-dest.txt');

      const resultDiff = genDiff(flatJson1, emptyJson);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing 2 empty jsons', () => {
      const expected = readFileAsString('flat-diff-empty-both.txt');

      const resultDiff = genDiff(emptyJson, emptyJson);

      expect(resultDiff).toBe(expected);
    });
  });

  describe('Test for nested structures', () => {
    test('Should return valid diff when calling with stylish formatter', () => {
      const json1 = readFileAsJson('nested1.json');
      const json2 = readFileAsJson('nested2.json');
      const expected = readFileAsString('nested-diff.txt');

      const actual = genDiff(json1, json2, 'stylish');

      expect(actual).toBe(expected);
    });

    test('Should return valid diff when calling with plain formatter', () => {
      const json1 = readFileAsJson('nested1.json');
      const json2 = readFileAsJson('nested2.json');
      const expected = readFileAsString('plain.txt');

      const actual = genDiff(json1, json2, 'plain');

      expect(actual).toBe(expected);
    });

    test('Should return valid json when calling with json formatter', () => {
      const json1 = readFileAsJson('nested1.json');
      const json2 = readFileAsJson('nested2.json');
      const expected = readFileAsJson('json-formatter-result.json');

      const actual = genDiff(json1, json2, 'json');

      expect(actual).toEqual(expected);
    });

    test('Should throw error for not supported formatters', () => {
      const json1 = readFileAsJson('nested1.json');
      const json2 = readFileAsJson('nested2.json');

      const actual = () => genDiff(json1, json2, 'blabla');

      expect(actual).toThrow();
    });
  });
});
