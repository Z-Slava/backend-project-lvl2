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
  test('Shuld return valid json string', () => {
    const ast = _.cloneDeep(nestedAst);

    const data = json(ast);

    expect(() => JSON.parse(data)).not.toThrow();
  });

  test('Should return json when called with valid ast 1', () => {
    const expected = _.cloneDeep(flatAst);

    const data = json(flatAst);
    const actual = JSON.parse(data);

    expect(actual).toEqual(expected);
  });

  test('Should return json when called with valid ast 2', () => {
    const expected = _.cloneDeep(nestedAst);

    const data = json(nestedAst);
    const actual = JSON.parse(data);

    expect(actual).toEqual(expected);
  });

  test('Should be immutable', () => {
    const ast = _.cloneDeep(nestedAst);
    const expected = _.cloneDeep(nestedAst);

    const data = json(ast);
    const actual = JSON.parse(data);
    _.set(ast, '[0].value', 'sad world');

    expect(actual).toEqual(expected);
    expect(actual[0].value).not.toBe(ast[0].value);
  });
});
