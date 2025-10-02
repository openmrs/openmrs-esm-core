import { BaseLexer } from 'i18next-parser';

export default class ObjectLexer extends BaseLexer {
  constructor(options = {}) {
    super(options);
  }

  // `content` is literally just the text content of the file. We use a
  // regex matcher to extract the key-value pairs.
  // Supports single quotes, double quotes, and backticks, including escaped quotes.
  extract(content) {
    const regex = /(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g;
    let keys = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const key = match[1];
      // The value is in one of groups 2, 3, or 4 depending on quote type
      const rawValue = match[2] || match[3] || match[4];
      // Unescape any escaped characters
      const defaultValue = rawValue.replace(/\\(.)/g, '$1');
      keys.push({ key, defaultValue });
    }
    return keys;
  }
}
