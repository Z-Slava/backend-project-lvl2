import _ from 'lodash';
import json from '../../src/formatters/json.js';

const flatAst = [
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

const nestedAst = [
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

describe('Test json formatter', () => {
  test('Should return json when called with valid ast 1', () => {
    const expected = _.cloneDeep(flatAst);

    const actual = json(expected);

    expect(actual).toEqual(expected);
  });

  test('Should return json when called with valid ast 2', () => {
    const expected = _.cloneDeep(nestedAst);

    const actual = json(expected);

    expect(actual).toEqual(expected);
  });
  test('Should be immutable', () => {
    const ast = _.cloneDeep(nestedAst);
    const expected = _.cloneDeep(ast);

    const actual = json(ast);
    ast[0].value = 'sad world';

    expect(actual).toEqual(expected);
    expect(actual[0].value).not.toBe(ast[0].value);
  });
});
