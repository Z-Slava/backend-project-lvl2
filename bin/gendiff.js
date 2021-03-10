#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const program = new Command();

const getJsonFromFile = (filePath) => {
  const absolutePath = filePath.startsWith('/') ? filePath : path.join(process.cwd(), filePath);
  const file = readFileSync(absolutePath, 'utf-8');
  const json = JSON.parse(file);

  return json;
};

program
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((filePath1, filePath2) => {
    const json1 = getJsonFromFile(filePath1);
    const json2 = getJsonFromFile(filePath2);

    const result = genDiff(json1, json2);

    console.log(result);
  })
  .parse();
