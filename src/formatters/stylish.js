import { isNestedDiffNode } from '../getDiffAST.js';

const stylish = (diff) => {
  const iter = (currentDiff, keyPadding = 2, bracketPadding = 0) => {
    if (currentDiff.length < 1) {
      return '{}';
    }

    const result = currentDiff.reduce((acc, node) => {
      const { key, sign } = node;
      const signedKey = `${sign} ${key}`;

      if (isNestedDiffNode(node)) {
        const nestedObject = iter(node.children, keyPadding + 4, bracketPadding + 4);
        return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${nestedObject}\n`;
      }

      return `${acc}${' '.repeat(keyPadding)}${signedKey}: ${node.value}\n`;
    }, '');

    return `{\n${result}${' '.repeat(bracketPadding)}}`;
  };

  return iter(diff);
};

export default stylish;
