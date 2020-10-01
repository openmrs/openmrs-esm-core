export function loadConfig(envVariables: Record<string, any>) {
  Object.keys(envVariables).forEach((key) => {
    process.env[key] = envVariables[key];
  });

  return require("@openmrs/esm-app-shell/webpack.config.js");
}
