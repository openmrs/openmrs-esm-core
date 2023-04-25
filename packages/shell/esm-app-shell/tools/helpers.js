/**
 * Removes the trailing slash from a path
 *
 * @param {string} path - The path to remove the trailing slash from
 * @returns {string} The path without a trailing slash
 */
exports.removeTrailingSlash = (path) => {
  const i = path.length - 1;
  return path[i] === "/"
    ? exports.removeTrailingSlash(path.substr(0, i))
    : path;
};

/**
 * Left-pads a number to ensure it is exactly two characters
 *
 * @param {string | number} num - The number to pad
 * @returns {string} The number as a string, padded to two places
 */
const padToTwoDigits = (num) => {
  return num.toString().padStart(2, "0");
};

exports.getTimestamp = () => {
  const today = new Date();
  const dd = padToTwoDigits;
  return `${today.getFullYear()}${dd(today.getMonth() + 1)}${dd(
    today.getDate()
  )}`;
};
