export const globals = {
  Array,
  Boolean,
  Symbol,
  Infinity,
  NaN,
  Math,
  Number,
  BigInt,
  String,
  RegExp,
  JSON,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  encodeURI,
  encodeURIComponent,
  Object: {
    __proto__: undefined,
    assign: Object.assign.bind(null),
    fromEntries: Object.fromEntries.bind(null),
    hasOwn: Object.hasOwn.bind(null),
    keys: Object.keys.bind(null),
    is: Object.is.bind(null),
    values: Object.values.bind(null),
  },
};

export const globalsAsync = {
  ...globals,
  Promise,
};
