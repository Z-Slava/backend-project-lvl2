import _ from 'lodash';

const normalizeValue = (value) => {
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
  '+': (prop, value) => `Property '${prop}' was added with value: ${normalizeValue(value)}`,
  '-+': (prop, value, prevValue) =>
    `Property '${prop}' was updated. From ${normalizeValue(prevValue)} to ${normalizeValue(value)}`,
};

const getFlatDiff = (nodes, currentProp = '') =>
  nodes.reduce((acc, { type, key, value, sign }) => {
    if (type === 'nested' && sign === ' ') {
      return [...acc, ...getFlatDiff(value, `${currentProp}${key}.`)];
    }

    return [...acc, { prop: `${currentProp}${key}`, value, sign }];
  }, []);

const removeUnchengedProps = (flatDiff) => flatDiff.filter(({ sign }) => sign !== ' ');

const mergeUpdatedProps = (flatDiff) => {
  const [initValue, rest] = [_.head(flatDiff), _.tail(flatDiff)];

  return rest.reduce(
    (acc, node) => {
      const lastModification = _.last(acc);
      const { prop, value } = node;

      if (prop === lastModification.prop) {
        return [
          ..._.initial(acc),
          { prop, value, valueToCompare: lastModification.value, sign: '-+' },
        ];
      }

      return [...acc, node];
    },
    [initValue]
  );
};

const plain = (diff) => {
  const flatDiff = getFlatDiff(diff);
  const onlyModifiedProps = removeUnchengedProps(flatDiff);
  const preparedData = mergeUpdatedProps(onlyModifiedProps);

  return preparedData
    .map(({ prop, value, valueToCompare, sign }) => actions[sign](prop, value, valueToCompare))
    .join('\n');
};

export default plain;
