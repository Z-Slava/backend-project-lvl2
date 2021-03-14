#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import genDiff from '../src/index.js';
import getParsedFile from '../src/parsers/index.js';
import stylish from '../src/formatters/index.js';

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

const getFormatter = (name) => {
  const formatters = {
    stylish,
  };

  return formatters[name];
};

program
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filePath1, filePath2, options) => {
    const json1 = getJsonFromFile(filePath1);
    const json2 = getJsonFromFile(filePath2);

    const formatter = getFormatter(options.format);

    const result = genDiff(json1, json2, formatter);

    console.log(result);
  })
  .parse();
