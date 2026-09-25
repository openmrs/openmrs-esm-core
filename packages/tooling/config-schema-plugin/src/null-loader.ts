/**
 * Replaces stylesheets during extraction.
 *
 * Extraction runs a module's real entry point, so it pulls in every stylesheet the component tree
 * imports. None of them matter to a config schema, and compiling them would be the slowest part of
 * the build. The replacement answers any property with its own name, the way a CSS-modules object
 * behaves, so component code that reads a class name at module scope still gets a string.
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
