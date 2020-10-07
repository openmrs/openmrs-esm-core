export function setEnvVariables(envVariables: Record<string, any>) {
  Object.keys(envVariables).forEach((key) => {
    process.env[key] = envVariables[key];
  });
}
