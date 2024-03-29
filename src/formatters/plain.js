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
    const normalizedPropMessage = `Property '${prop}' was updated.`;
    const normalizedDiffMessage = `From ${normalizeValue(prevValue)} to ${normalizeValue(value)}`;
    return `${normalizedPropMessage} ${normalizedDiffMessage}`;
  },
};

const getFlatDiff = (nodes, currentProp = '') => nodes.reduce((acc, node) => {
  const { key, sign } = node;
  if (isExtendableDiffNode(node)) {
    return [...acc, ...getFlatDiff(node.children, `${currentProp}${key}.`)];
  }

  return [...acc, { prop: `${currentProp}${key}`, value: getDiffNodeValue(node), sign }];
}, []);

const removeUnchangedProps = (flatDiff) => flatDiff.filter((node) => !isUntouchedDiffNode(node));

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
  const onlyModifiedProps = removeUnchangedProps(flatDiff);
  const preparedData = mergeUpdatedProps(onlyModifiedProps);

  return preparedData
    .map((node) => {
      const {
        prop, value, valueToCompare, sign,
      } = node;
      return actions[sign](prop, value, valueToCompare);
    })
    .join('\n');
};

export default plain;
