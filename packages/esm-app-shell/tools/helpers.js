exports.removeTrailingSlash = (path) => {
  const i = path.length - 1;
  return path[i] === "/" ? removeTrailingSlash(path.substr(0, i)) : path;
};
