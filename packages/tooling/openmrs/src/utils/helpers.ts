import { util } from '@rspack/core';

export function trimEnd(text: string, chr: string): string {
  while (text.endsWith(chr)) {
    text = text.slice(0, text.length - chr.length);
  }
  return text;
}

export function removeTrailingSlash(path: string): string {
  const i = path.length - 1;
  return path[i] === '/' ? removeTrailingSlash(path.slice(0, i)) : path;
}

export function contentHash(obj: object) {
  const hash = util.createHash('xxhash64');
  hash.update(JSON.stringify(obj), 'UTF-8');
  return hash.digest().toString('hex');
}
