import _ from 'lodash';

const json = (ast) => {
  const copy = _.cloneDeep(ast);

  return JSON.stringify(copy);
};

export default json;
