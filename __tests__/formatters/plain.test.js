import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import plain from '../../src/formatters/plain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');
const readFileAsString = (filename) => readFile(filename).toString('utf-8');

describe('Test plain formatter', () => {
  test('Should return plain diff when called with valid ast 1', () => {
    const ast = [
      {
        type: 'flat',
        key: 'first_key',
        value: 'hello world',
        sign: '+',
      },
      {
        type: 'flat',
        key: 'second_key',
        value: 'goodby world',
        sign: '-',
      },
      {
        type: 'flat',
        key: 'third_key',
        value: 'stable world',
        sign: ' ',
      },
    ];
    const expected = readFileAsString('plain1.txt');

    const actual = plain(ast);

    expect(actual).toBe(expected);
  });

  test('Should return plain diff when called with valid ast 2', () => {
    const ast = [
      {
        type: 'nested',
        key: 'first_key',
        children: [
          {
            type: 'flat',
            key: 'inner_key',
            value: 'inner world',
            sign: ' ',
          },
        ],
        sign: '+',
      },
      {
        type: 'flat',
        key: 'second_key',
        value: 'goodby world',
        sign: '-',
      },
      {
        type: 'nested',
        key: 'third_key',
        children: [
          {
            type: 'flat',
            key: 'inner_key1',
            value: 'goodby world',
            sign: '-',
          },
          {
            type: 'flat',
            key: 'inner_key2',
            value: 'hello world',
            sign: '+',
          },
        ],
        sign: ' ',
      },
    ];
    const expected = readFileAsString('plain2.txt');

    const actual = plain(ast);

    expect(actual).toBe(expected);
  });
});
