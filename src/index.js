import _ from 'lodash';
import stylish from './formatters/index.js'

const compareBySameKeys = ([key1], [key2]) => key1 === key2;

const createFlatDiffNode = ([key, value], sign) => ({ type: 'flat', key, value, sign });
const createNestedDiffNode = ([key, value], modifiedValue, sign) => ({
  type: 'nested',
  key,
  value,
  modifiedValue,
  sign,
});

export const isNestedDiffNode = ({ type }) => type === 'nested';

const transformPairToDiffNode = (sign) => ([key, value]) => {
  if (_.isObject(value)) {
    return createNestedDiffNode([key, _.cloneDeep(value)], _.cloneDeep(value), sign);
  }
  return createFlatDiffNode([key, value], sign);
};

const transformPairsToDiffNodes = ([originalPair, modifiedPair]) => {
  const [originalKey, originalValue] = originalPair;
  const [, modifiedValue] = modifiedPair;

  const originalValueCopy = _.cloneDeep(originalValue);
  const modifiedValueCopy = _.cloneDeep(modifiedValue);

  if (_.isObject(originalValue) && _.isObject(modifiedValue)) {
    return [createNestedDiffNode([originalKey, originalValueCopy], modifiedValueCopy, ' ')];
  }

  if (_.isObject(originalValue)) {
    return [
      createNestedDiffNode([originalKey, originalValueCopy], originalValueCopy, '-'),
      createFlatDiffNode([originalKey, modifiedValue], '+'),
    ];
  }

  if (_.isObject(modifiedValue)) {
    return [
      createFlatDiffNode([originalKey, originalValue], '-'),
      createNestedDiffNode([originalKey, modifiedValueCopy], modifiedValueCopy, '+'),
    ];
  }

  return [
    createFlatDiffNode([originalKey, originalValue], '-'),
    createFlatDiffNode([originalKey, modifiedValue], '+'),
  ];
};

const getPairsFactory = (originalPair, modifiedPair) => {
  const getDeletedPairs = (original, modified) => () => {
    const uniqueUnion = _.unionWith(original, modified, compareBySameKeys);
    const deleted = _.differenceWith(uniqueUnion, modified, compareBySameKeys);

    return deleted;
  };

  const getAddedPairs = (original, modified) => () => {
    const uniqueUnion = _.unionWith(original, modified, compareBySameKeys);
    const added = _.differenceWith(uniqueUnion, original, compareBySameKeys);

    return added;
  };

  const getUnchangedPairs = (original, modified) => () => {
    const leftIntersection = _.intersectionWith(original, modified, compareBySameKeys);
    const rightIntersection = _.intersectionWith(modified, original, compareBySameKeys);
    const unchanged = _.intersectionWith(leftIntersection, rightIntersection, _.isEqual);

    return unchanged;
  };

  const getDiffPairs = (original, modified) => () => {
    const i1 = _.intersectionWith(original, modified, compareBySameKeys);
    const i2 = _.intersectionWith(modified, original, compareBySameKeys);
    const diff = _.sortBy(_.xorWith(i1, i2, _.isEqual), 0);
    const chunkedDiff = _.chunk(diff, 2);

    return chunkedDiff;
  };

  return {
    getDeletedPairs: getDeletedPairs(originalPair, modifiedPair),
    getAddedPairs: getAddedPairs(originalPair, modifiedPair),
    getUnchangedPairs: getUnchangedPairs(originalPair, modifiedPair),
    getDiffPairs: getDiffPairs(originalPair, modifiedPair),
  };
};

const getAST = (originalJson, modifiedJson) => {
  const pairsFactory = getPairsFactory(Object.entries(originalJson), Object.entries(modifiedJson));

  const unchangedNodes = pairsFactory.getUnchangedPairs().map(transformPairToDiffNode(' '));
  const deletedNodes = pairsFactory.getDeletedPairs().map(transformPairToDiffNode('-'));
  const addedNodes = pairsFactory.getAddedPairs().map(transformPairToDiffNode('+'));
  const diffNodes = pairsFactory.getDiffPairs().flatMap(transformPairsToDiffNodes);

  const result = [...unchangedNodes, ...deletedNodes, ...addedNodes, ...diffNodes];

  const flatResult = result.map((node) => {
    if (isNestedDiffNode(node)) {
      const { key, value, modifiedValue, sign } = node;
      const flatValue = getAST(value, modifiedValue);
      return createNestedDiffNode([key, flatValue], flatValue, sign)
    }
    return node;
  });


  return _.sortBy(flatResult, 'key');
};

const genDiff = (originalJson, modifiedJson, formatter = stylish) => {
  const ast = getAST(originalJson, modifiedJson);
  const stiledDiff = formatter(ast);

  return stiledDiff;
};

export default genDiff;
