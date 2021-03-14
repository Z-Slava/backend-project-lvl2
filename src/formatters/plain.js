import _ from 'lodash';

const getCorrectDisplay = (value) => {
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return value;
};

const actions = {
  '-': (prop) => `Property '${prop}' was removed`,
  '+': (prop, value) => `Property '${prop}' was added with value: ${getCorrectDisplay(value)}`,
  '-+': (prop, value, prevValue) =>
    `Property '${prop}' was updated. From ${getCorrectDisplay(prevValue)} to ${getCorrectDisplay(
      value
    )}`,
};

const plain = (diff) => {
  const getFlatDiff = (nodes, currentProp) => {
    const flat = nodes.reduce((acc, node) => {
      if (node.type === 'nested') {
        if (node.sign === '-' || node.sign === '+') {
          return [
            ...acc,
            { prop: `${currentProp}${node.key}`, value: node.value, sign: node.sign },
          ];
        }
        return [...acc, ...getFlatDiff(node.value, `${currentProp}${node.key}.`)];
      }

      return [...acc, { prop: `${currentProp}${node.key}`, value: node.value, sign: node.sign }];
    }, []);

    return flat;
  };

  const flatDiff = getFlatDiff(diff, '');
  const onlyModifiedProps = flatDiff
    .filter(({ sign }) => sign !== ' ')
    .reduce((acc, node) => {
      if (acc.length === 0) {
        return [node];
      }
      const last = _.last(acc);
      if (node.prop === last.prop) {
        return [
          ..._.initial(acc),
          { prop: node.prop, value: node.value, valueToCompare: last.value, sign: '-+' },
        ];
      }
      return [...acc, node];
    }, []);

  return onlyModifiedProps
    .map(({ prop, value, valueToCompare, sign }) => actions[sign](prop, value, valueToCompare))
    .join('\n');
};

export default plain;
