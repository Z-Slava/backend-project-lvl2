import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');
const readFileAsString = (filename) => readFile(filename).toString('utf-8');
const readFileAsJson = (filename) => JSON.parse(readFile(filename));

describe('Testing genDiff on flat json', () => {
  test('Should return valid diff', () => {
    const json1 = readFileAsJson('hexlet1.json');
    const json2 = readFileAsJson('hexlet2.json');
    const expected = readFileAsString('hexlet-diff.txt');

    expect(genDiff(json1, json2)).toBe(expected);
  });
});
