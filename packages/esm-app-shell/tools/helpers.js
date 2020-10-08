exports.removeTrailingSlash = (path) => {
  const i = path.length - 1;
  return path[i] === "/" ? removeTrailingSlash(path.substr(0, i)) : path;
};

exports.doubleDigit = (num) => {
  return num.toString().padStart(2, '0');
};

exports.getTimestamp = () => {
  const today = new Date();
  const dd = exports.doubleDigit;
  return `${today.getFullYear()}${dd(today.getMonth() + 1)}${dd(today.getDate())}`;
};
