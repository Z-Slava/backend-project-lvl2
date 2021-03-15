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

describe('Test genDiff function', () => {
  describe('Tests for flat stractures #flat', () => {
    test('Should return valid diff when passing 2 not empty jsons', () => {
      const json1 = readFileAsJson('hexlet1.json');
      const json2 = readFileAsJson('hexlet2.json');
      const expected = readFileAsString('hexlet-diff.txt');

      const resultDiff = genDiff(json1, json2);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing empty first json', () => {
      const json1 = readFileAsJson('empty.json');
      const json2 = readFileAsJson('hexlet2.json');
      const expected = readFileAsString('hexlet-diff-empty-source.txt');

      const resultDiff = genDiff(json1, json2);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing empty second json', () => {
      const json1 = readFileAsJson('hexlet1.json');
      const json2 = readFileAsJson('empty.json');
      const expected = readFileAsString('hexlet-diff-empty-dest.txt');

      const resultDiff = genDiff(json1, json2);

      expect(resultDiff).toBe(expected);
    });

    test('Should return valid diff when passing 2 empty jsons', () => {
      const json1 = readFileAsJson('empty.json');
      const json2 = readFileAsJson('empty.json');
      const expected = readFileAsString('hexlet-diff-empty.txt');

      const resultDiff = genDiff(json1, json2);

      expect(resultDiff).toBe(expected);
    });
  });

  describe('Test for nested structures #nested', () => {
    test('Should return valid diff when calling with stylish formatter', () => {
      const json1 = readFileAsJson('nested-json1.json');
      const json2 = readFileAsJson('nested-json2.json');
      const expected = readFileAsString('nested-diff.txt');

      const actual = genDiff(json1, json2, 'stylish');

      expect(actual).toBe(expected);
    });

    test('Should return valid diff when calling with plain formatter', () => {
      const json1 = readFileAsJson('nested-json1.json');
      const json2 = readFileAsJson('nested-json2.json');
      const expected = readFileAsString('plain.txt');

      const actual = genDiff(json1, json2, 'plain');

      expect(actual).toBe(expected);
    });

    test('Should return valid json when calling with json formatter', () => {
      const json1 = readFileAsJson('nested-json1.json');
      const json2 = readFileAsJson('nested-json2.json');
      const expected = readFileAsJson('json-formatter-result.json');

      const actual = genDiff(json1, json2, 'json');

      expect(actual).toEqual(expected);
    });

    test('Should throw error for not supported formatters', () => {
      const json1 = readFileAsJson('nested-json1.json');
      const json2 = readFileAsJson('nested-json2.json');

      const actual = () => genDiff(json1, json2, 'blabla');

      expect(actual).toThrow();
    });
  });
});
