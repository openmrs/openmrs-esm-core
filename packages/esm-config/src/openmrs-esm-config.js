const configs = [];
const schemas = {};

export function defineConfigSchema(moduleName, schema) {
  console.log("Taking schema for " + moduleName);
  schemas[moduleName] = schema;
  console.log("Current configs: " + JSON.stringify(configs));
}

export function provide(config) {
  console.log("provide recieved config");
  console.log(config);
  configs.push(config);
  console.log("Current schemata: " + JSON.stringify(schemas));
}

export function getConfig(moduleName) {
  console.log("getConfig");
  console.log(configs);
  return configs[0][moduleName];
}
