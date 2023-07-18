import yaml from 'js-yaml';

const extensions = [
  {
    names: ['.yaml', '.yml'],
    parser: yaml.load,
  },
  {
    names: ['.json'],
    parser: JSON.parse,
  },
];

const getParser = (extName) => extensions.find(({ names }) => names.includes(extName)) || {};

const getParsedFile = (file, options = { ext: '.json' }) => {
  const { parser } = getParser(options.ext);

  if (!parser) {
    throw Error(`Files with ${options.ext} extension are not supported`);
  }

  return parser(file);
};

export default getParsedFile;
