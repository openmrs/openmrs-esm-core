import * as Config from "./openmrs-esm-config";

describe('Config', () => {

  it('returns the provided config file', () => {
    const testConfig = { foo: 'bar' }
    Config.provide(testConfig)
    console.log(Config.getConfig("foo"))
  });
});
