#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import genDiff from '../src/index.js';
import getParsedFile from '../src/parsers/index.js';

const program = new Command();

const getAbsolutePath = (filePath) =>
  filePath.startsWith('/') ? filePath : path.join(process.cwd(), filePath);

const getJsonFromFile = (filePath) => {
  const absolutePath = getAbsolutePath(filePath);

  const file = readFileSync(absolutePath, 'utf-8');
  const ext = path.extname(filePath);

  const json = getParsedFile(file, { ext });

  return json;
};

program
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filePath1, filePath2, options) => {
    const json1 = getJsonFromFile(filePath1);
    const json2 = getJsonFromFile(filePath2);

    const result = genDiff(json1, json2, options.format);

    console.log(result);
  })
  .parse();
