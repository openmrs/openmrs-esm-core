const { default: extendConfig, ...rest } = require("@openmrs/webpack-config");

module.exports = Object.assign(extendConfig, rest);
