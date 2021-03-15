import _ from 'lodash';
import json from '../../src/formatters/json.js';

describe('Test plain formatter', () => {
  test('Should return json when called with valid ast 1', () => {
    const expected = [
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

    const actual = json(expected);

    expect(actual).toEqual(expected);
  });

  test('Should return json when called with valid ast 2', () => {
    const expected = [
      {
        type: 'nested',
        key: 'first_key',
        value: [
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
        value: [
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

    const actual = json(expected);

    expect(actual).toEqual(expected);
  });
  test('Should be immutable', () => {
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
    const expected = _.cloneDeep(ast);

    const actual = json(ast);
    ast[0].value = 'sad world';

    expect(actual).toEqual(expected);
    expect(actual[0].value).not.toBe(ast[0].value);
  });
});
