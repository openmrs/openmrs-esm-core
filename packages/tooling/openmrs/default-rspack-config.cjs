const { default: extendConfig, ...rest } = require('@openmrs/rspack-config');

module.exports = Object.assign(extendConfig, rest);
