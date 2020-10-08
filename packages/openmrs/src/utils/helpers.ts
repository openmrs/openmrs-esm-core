export function trimEnd(text: string, chr: string) {
  while (text.endsWith(chr)) {
    text = text.substr(0, text.length - chr.length);
  }

  return text;
}
