import yaml from 'js-yaml';

const yamlExts = ['.yaml', '.yml'];

const getParserdFile = (file, extname) => {
  if (extname === '.json') {
    return JSON.parse(file);
  }
  if (yamlExts.includes(extname)) {
    return yaml.load(file);
  }

  throw Error(`${extname} is not supported`);
};

export default getParserdFile;
