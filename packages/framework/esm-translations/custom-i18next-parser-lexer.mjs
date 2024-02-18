import { BaseLexer } from 'i18next-parser';

export default class ObjectLexer extends BaseLexer {
  constructor(options = {}) {
    super(options);
  }

  // `content` is literally just the text content of the file. We use a
  // regex matcher to extract the key-value pairs.
  extract(content) {
    const regex = /(?<=\s*)(\w+)\s*:\s*'([^']+)'/g;
    let keys = []
    let match;
    while ((match = regex.exec(content)) !== null) {
      keys.push({ key: match[1], defaultValue: match[2] });
    }
    return keys;
  }
}
