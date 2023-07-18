import { readFileSync } from 'fs';
import path from 'path';
import getFormatter from './formatters/index.js';
import genDiffAST from './getDiffAST.js';
import getParsedFile from './parsers/index.js';

const DEFAULT_FORMAT_STYLE = 'stylish';

const isPathAbsolute = (filePath) => filePath.startsWith('/');

const getAbsolutePath = (filePath) => (
  isPathAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath)
);

const getJsonFromFile = (filePath) => {
  const absolutePath = getAbsolutePath(filePath);

  const file = readFileSync(absolutePath, 'utf-8');
  const ext = path.extname(filePath);

  return getParsedFile(file, { ext });
};

const genDiff = (originalFilePath, modifiedFilePath, formatterName = DEFAULT_FORMAT_STYLE) => {
  const originalJson = getJsonFromFile(originalFilePath);
  const modifiedJson = getJsonFromFile(modifiedFilePath);

  const ast = genDiffAST(originalJson, modifiedJson);
  const formatter = getFormatter(formatterName);

  return formatter(ast);
};

export default genDiff;
