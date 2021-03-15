import _ from 'lodash';

const json = (ast) => {
  const copy = _.cloneDeep(ast);

  return copy;
};

export default json;
