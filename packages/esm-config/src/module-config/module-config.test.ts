import * as Config from "./module-config";

describe("getConfig", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("uses config values from the provided config file", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = { "foo-module": { foo: "bar" } };
    Config.provide(testConfig);
    const config = Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("returns default values from the schema", () => {
    Config.defineConfigSchema("testmod", {
      foo: {
        default: "qux"
      }
    });
    const config = Config.getConfig("testmod");
    expect(config.foo).toBe("qux");
  });

  it("requires config values to have been defined in the schema", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    expect(() => Config.getConfig("foo-module")).toThrowError(/schema/);
  });

  it("requires nested config values to have been defined in the schema", () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { default: "qux" } }
    });
    Config.provide({ "foo-module": { foo: { doof: "nope" } } });
    expect(() => Config.getConfig("foo-module")).toThrowError(/schema/);
  });

  it("throws if looking up module with no schema", () => {
    expect(() => Config.getConfig("fake-module")).toThrowError(
      /schema.*defined/
    );
  });

  it("returns a nested configuration", () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        bar: {
          default: -1
        },
        baz: {
          qux: {
            default: "N/A"
          },
          quy: {
            default: ""
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: {
          bar: 0,
          baz: {
            quy: "xyz"
          }
        }
      }
    };
    Config.provide(testConfig);
    const config = Config.getConfig("foo-module");
    expect(config.foo.bar).toBe(0);
    expect(config.foo.baz.qux).toBe("N/A");
    expect(config.foo.baz.quy).toBe("xyz");
  });
});
