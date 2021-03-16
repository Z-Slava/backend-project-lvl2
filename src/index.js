import { readFileSync } from 'fs';
import path from 'path';
import getFormatter from './formatters/index.js';
import genDiffAST from './getDiffAST.js';
import getParsedFile from './parsers/index.js';

const getAbsolutePath = (filePath) =>
  filePath.startsWith('/') ? filePath : path.join(process.cwd(), filePath);

const getJsonFromFile = (filePath) => {
  const absolutePath = getAbsolutePath(filePath);

  const file = readFileSync(absolutePath, 'utf-8');
  const ext = path.extname(filePath);

  const json = getParsedFile(file, { ext });

  return json;
};

const genDiff = (originalFilePath, modifiedFilePath, formatterName = 'stylish') => {
  const originalJson = getJsonFromFile(originalFilePath);
  const modifiedJson = getJsonFromFile(modifiedFilePath);

  const ast = genDiffAST(originalJson, modifiedJson);
  const formatter = getFormatter(formatterName);
  const formattedDiff = formatter(ast);

  return formattedDiff;
};

export default genDiff;
