import _ from 'lodash';

const createFlatDiffNode = (key, value, sign) => ({
  type: 'flat',
  key,
  value,
  sign,
});

const createNestedDiffNode = (key, children, sign, optionalProps = {}) => ({
  type: 'nested',
  key,
  children: _.cloneDeep(children),
  sign,
  ...optionalProps,
});

export const isNestedDiffNode = ({ type }) => type === 'nested';

export const isUntouchedDiffNode = ({ sign }) => sign === ' ';

export const isExtendableDiffNode = (node) => isNestedDiffNode(node) && isUntouchedDiffNode(node);

export const getDiffNodeValue = (node) => (isNestedDiffNode(node) ? node.children : node.value);

const getDeletedKeys = (originalKeys, modifiedKeys) => _.difference(originalKeys, modifiedKeys);
const getAddedKeys = (originalKeys, modifiedKeys) => _.difference(modifiedKeys, originalKeys);
const getCommonKeys = (originalKeys, modifiedKeys) => _.intersection(originalKeys, modifiedKeys);

const extractKeys = (json1, json2) => [Object.keys(json1), Object.keys(json2)];

const getNodesFromJson = (json, sign) => (key) => {
  if (!_.isObject(json[key])) {
    return createFlatDiffNode(key, json[key], sign);
  }

  return createNestedDiffNode(key, json[key], sign, { valueToCompare: json[key] });
};

const actions = [
  {
    predicate: (originalValue, modifiedValue) => _.isObject(originalValue) && _.isObject(modifiedValue),
    action: (originalJson, modifiedJson, key) => [
      createNestedDiffNode(key, modifiedJson[key], ' ', { valueToCompare: originalJson[key] }),
    ],
  },
  {
    predicate: (originalValue, modifiedValue) => _.isObject(originalValue) && !_.isObject(modifiedValue),
    action: (originalJson, modifiedJson, key) => [
      createNestedDiffNode(key, originalJson[key], '-', { valueToCompare: originalJson[key] }),
      createFlatDiffNode(key, modifiedJson[key], '+'),
    ],
  },
  {
    predicate: (originalValue, modifiedValue) => !_.isObject(originalValue) && _.isObject(modifiedValue),
    action: (originalJson, modifiedJson, key) => [
      createFlatDiffNode(key, originalJson[key], '-'),
      createNestedDiffNode(key, modifiedJson[key], '+', { valueToCompare: modifiedJson[key] }),
    ],
  },
  {
    predicate: (originalValue, modifiedValue) => !_.isObject(originalValue) && !_.isObject(modifiedValue),
    action: (originalJson, modifiedJson, key) => [
      createFlatDiffNode(key, originalJson[key], '-'),
      createFlatDiffNode(key, modifiedJson[key], '+'),
    ],
  },
];

const getAction = (originalValue, modifiedValue) => {
  const { action } = actions.find(({ predicate }) => predicate(originalValue, modifiedValue));
  return action;
};

const getNodesFromJsons = (originalJson, modifiedJson) => (key) => {
  const action = getAction(originalJson[key], modifiedJson[key]);
  return action(originalJson, modifiedJson, key);
};

const getDeletedNodes = (originalJson, modifiedJson) =>
  getDeletedKeys(...extractKeys(originalJson, modifiedJson)).map(getNodesFromJson(originalJson, '-'));

const getAddedNodes = (originalJson, modifiedJson) =>
  getAddedKeys(...extractKeys(originalJson, modifiedJson)).map(getNodesFromJson(modifiedJson, '+'));

const getUntouchedNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);
  const commonKeys = getCommonKeys(originalKeys, modifiedKeys);
  const untouchedKeys = commonKeys.filter((key) => _.isEqual(originalJson[key], modifiedJson[key]));

  return untouchedKeys.map(getNodesFromJson(originalJson, ' '));
};

const getDiffNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);
  const commonKeys = getCommonKeys(originalKeys, modifiedKeys);
  const diffKeys = commonKeys.filter((key) => !_.isEqual(originalJson[key], modifiedJson[key]));

  return diffKeys.flatMap(getNodesFromJsons(originalJson, modifiedJson));
};

const getDiffAST = (originalJson, modifiedJson) => {
  const deletedNodes = getDeletedNodes(originalJson, modifiedJson);
  const addedNodes = getAddedNodes(originalJson, modifiedJson);
  const untouchedNodes = getUntouchedNodes(originalJson, modifiedJson);
  const diffNodes = getDiffNodes(originalJson, modifiedJson);

  const result = [...deletedNodes, ...addedNodes, ...untouchedNodes, ...diffNodes];

  const sortedResult = _.sortBy(result, 'key');

  return sortedResult.map((node) => {
    if (isNestedDiffNode(node)) {
      const { key, children, valueToCompare, sign } = node;
      const flattenChildren = getDiffAST(valueToCompare, children);
      return createNestedDiffNode(key, flattenChildren, sign);
    }

    return node;
  });
};

export default getDiffAST;
