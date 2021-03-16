import _ from 'lodash';
import { isUntouchedDiffNode, isExtendableDiffNode, getDiffNodeValue } from '../getDiffAST.js';

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
  '-+': (prop, value, prevValue) => {
    const normilizedPropMessage = `Property '${prop}' was updated.`;
    const normilizedDiffMessage = `From ${normalizeValue(prevValue)} to ${normalizeValue(value)}`;
    const resultMessage = `${normilizedPropMessage} ${normilizedDiffMessage}`;
    return resultMessage;
  },
};

const getFlatDiff = (nodes, currentProp = '') => {
  const result = nodes.reduce((acc, node) => {
    const { key, sign } = node;
    if (isExtendableDiffNode(node)) {
      return [...acc, ...getFlatDiff(node.children, `${currentProp}${key}.`)];
    }

    return [...acc, { prop: `${currentProp}${key}`, value: getDiffNodeValue(node), sign }];
  }, []);

  return result;
};

const removeUnchengedProps = (flatDiff) => flatDiff.filter((node) => !isUntouchedDiffNode(node));

const mergeUpdatedProps = (flatDiff) => {
  const [initValue, rest] = [_.head(flatDiff), _.tail(flatDiff)];

  return rest.reduce(
    (acc, node) => {
      const lastModification = _.last(acc);
      const { prop, value } = node;

      if (prop === lastModification.prop) {
        return [
          ..._.initial(acc),
          {
            prop,
            value,
            valueToCompare: lastModification.value,
            sign: '-+',
          },
        ];
      }

      return [...acc, node];
    },
    [initValue],
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
