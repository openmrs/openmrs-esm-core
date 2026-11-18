/**
 * Replaces stylesheets during extraction, where compiling them would be the slowest part of the
 * build. Like a CSS-modules object, the replacement answers any property with its own name.
 */
function nullLoader(): string {
  return `
var styles = new Proxy({}, {
  get: function (target, property) {
    if (property === '__esModule') return true;
    if (property === 'default') return styles;
    // Answering these with their own names would leave the object with no way to become a
    // primitive, so interpolating it would throw instead of giving what a real CSS-modules object
    // gives. No stylesheet has a class by either name.
    if (property === 'toString' || property === 'valueOf') return Object.prototype[property];
    return typeof property === 'string' ? property : undefined;
  }
});
module.exports = styles;
`;
}

export = nullLoader;
