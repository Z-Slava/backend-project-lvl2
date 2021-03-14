import getFormatter from './formatters/index.js';
import genDiffAST from './getDiffAST.js';

const genDiff = (originalJson, modifiedJson, formatterName = 'stylish') => {
  const ast = genDiffAST(originalJson, modifiedJson);
  const formatter = getFormatter(formatterName);

  const formattedDiff = formatter(ast);

  return formattedDiff;
};

export default genDiff;
