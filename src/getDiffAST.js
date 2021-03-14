import _ from 'lodash';

const createFlatDiffNode = (key, value, sign) => ({
  type: 'flat',
  key,
  value,
  sign,
});

const createNestedDiffNode = (key, value, valueToCompare, sign) => ({
  type: 'nested',
  key,
  value: _.cloneDeep(value),
  valueToCompare: _.cloneDeep(valueToCompare),
  sign,
});

const isNestedDiffNode = ({ type }) => type === 'nested';

const getDeletedKeys = (originalKeys, modifiedKeys) => _.difference(originalKeys, modifiedKeys);
const getAddedKeys = (originalKeys, modifiedKeys) => _.difference(modifiedKeys, originalKeys);
const getCommonKeys = (originalKeys, modifiedKeys) => _.intersection(originalKeys, modifiedKeys);

const extractKeys = (json1, json2) => [Object.keys(json1), Object.keys(json2)];

const getDeletedNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);

  return getDeletedKeys(originalKeys, modifiedKeys).map((key) => {
    if (!_.isObject(originalJson[key])) {
      return createFlatDiffNode(key, originalJson[key], '-');
    }

    return createNestedDiffNode(key, originalJson[key], originalJson[key], '-');
  });
};

const getAddedNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);

  return getAddedKeys(originalKeys, modifiedKeys).map((key) => {
    if (!_.isObject(modifiedJson[key])) {
      return createFlatDiffNode(key, modifiedJson[key], '+');
    }

    return createNestedDiffNode(key, modifiedJson[key], modifiedJson[key], '+');
  });
};

const getUntouchedNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);
  const commonKeys = getCommonKeys(originalKeys, modifiedKeys);
  const untouchedKeys = commonKeys.filter((key) => _.isEqual(originalJson[key], modifiedJson[key]));

  return untouchedKeys.map((key) => {
    if (!_.isObject(originalJson[key])) {
      return createFlatDiffNode(key, originalJson[key], ' ');
    }

    return createNestedDiffNode(key, originalJson[key], originalJson[key], ' ');
  });
};

const getDiffNodes = (originalJson, modifiedJson) => {
  const [originalKeys, modifiedKeys] = extractKeys(originalJson, modifiedJson);
  const commonKeys = getCommonKeys(originalKeys, modifiedKeys);
  const diffKeys = commonKeys.filter((key) => !_.isEqual(originalJson[key], modifiedJson[key]));

  return diffKeys.flatMap((key) => {
    if (_.isObject(originalJson[key]) && _.isObject(modifiedJson[key])) {
      return [createNestedDiffNode(key, modifiedJson[key], originalJson[key], ' ')];
    }
    if (_.isObject(originalJson[key])) {
      return [
        createNestedDiffNode(key, originalJson[key], originalJson[key], '-'),
        createFlatDiffNode(key, modifiedJson[key], '+'),
      ];
    }
    if (_.isObject(modifiedJson[key])) {
      return [
        createFlatDiffNode(key, originalJson[key], '-'),
        createNestedDiffNode(key, modifiedJson[key], modifiedJson[key], '+'),
      ];
    }

    return [
      createFlatDiffNode(key, originalJson[key], '-'),
      createFlatDiffNode(key, modifiedJson[key], '+'),
    ];
  });
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
      const { key, value, valueToCompare, sign } = node;
      const flattenValue = getDiffAST(valueToCompare, value);
      return createNestedDiffNode(key, flattenValue, valueToCompare, sign);
    }

    return node;
  });
};

export default getDiffAST;
