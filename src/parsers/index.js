import yaml from 'js-yaml';

const exts = [
  {
    names: ['.yaml', '.yml'],
    parser: yaml.load,
  },
  {
    names: ['.json'],
    parser: JSON.parse,
  },
];

const getParser = (extName) => exts.find(({ names }) => names.includes(extName)) || {};

const getParserdFile = (file, options = { ext: '.json' }) => {
  const { parser } = getParser(options.ext);

  if (!parser) {
    throw Error(`${options.ext} is not supported`);
  }

  return parser(file);
};

export default getParserdFile;
