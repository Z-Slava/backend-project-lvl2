import _ from 'lodash';

const markAsDeleted = (pair) => [...pair, '-'];

const markAsAdded = (pair) => [...pair, '+'];

const markAsUnchanged = (pair) => [...pair, ' '];

const markAsDiff = ([originPair, modifiedPair]) => [
  markAsDeleted(originPair),
  markAsAdded(modifiedPair),
];

const compareBySameKeys = ([key1], [key2]) => key1 === key2;

const getDeletedPairs = (originPairs, modifiedPairs) => {
  const uniquePairsUnion = _.unionWith(originPairs, modifiedPairs, compareBySameKeys);

  return _.differenceWith(uniquePairsUnion, modifiedPairs, compareBySameKeys);
};

const getAddedPairs = (originPairs, modifiedPairs) => {
  const uniquePairsUnion = _.unionWith(originPairs, modifiedPairs, compareBySameKeys);

  return _.differenceWith(uniquePairsUnion, originPairs, compareBySameKeys);
};

const getDiffPairs = (originPairs, modifiedPairs) => {
  const i1 = _.intersectionWith(originPairs, modifiedPairs, compareBySameKeys);
  const i2 = _.intersectionWith(modifiedPairs, originPairs, compareBySameKeys);

  const diff = _.sortBy(_.xorWith(i1, i2, _.isEqual), 0);

  return _.chunk(diff, 2);
};

const getUnchangedPairs = (originPairs, modifiedPairs) => {
  const i1 = _.intersectionWith(originPairs, modifiedPairs, compareBySameKeys);
  const i2 = _.intersectionWith(modifiedPairs, originPairs, compareBySameKeys);

  const unchanged = _.intersectionWith(i1, i2, _.isEqual);

  return unchanged;
};

const genDiff = (json1, json2) => {
  const pairs1 = Object.entries(json1);
  const pairs2 = Object.entries(json2);

  const addedPart = getAddedPairs(pairs1, pairs2).map(markAsAdded);
  const deletedPart = getDeletedPairs(pairs1, pairs2).map(markAsDeleted);
  const diffPart = getDiffPairs(pairs1, pairs2).flatMap(markAsDiff);
  const unchangedPart = getUnchangedPairs(pairs1, pairs2).map(markAsUnchanged);

  const generalDiff = [...addedPart, ...deletedPart, ...diffPart, ...unchangedPart];
  const sortedDiff = _.sortBy(generalDiff, '0');
  const signedDiff = sortedDiff.map(([key, value, sign]) => [`${sign} ${key}`, value]);

  const resultStirng = JSON.stringify(_.fromPairs(signedDiff), null, 2)
    .replace(/"*([^"]+)"/g, '$1')
    .replace(/([^,]+),/g, '$1');

  return resultStirng;
};

export default genDiff;
