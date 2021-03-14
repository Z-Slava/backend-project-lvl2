import stylish from './formatters/index.js'
import genDiffAST from './getDiffAST.js'

const genDiff = (originalJson, modifiedJson, formatter = stylish) => {
  const ast = genDiffAST(originalJson, modifiedJson);
  const stiledDiff = formatter(ast);

  return stiledDiff;
};

export default genDiff;
