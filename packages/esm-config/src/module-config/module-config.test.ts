import * as Config from "./module-config";
import { validator } from "../validators/validator";

describe("defineConfigSchema", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    Config.clearAll();
  });

  it("logs an error if an unexpected value is provided as a key", () => {
    const schema = {
      bar: true
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*bar/)
    );
  });

  it("logs an error if an unexpected nested value is provided as a key", () => {
    const schema = {
      bar: { baz: "bad bad bad" }
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*bar\.baz/)
    );
  });
});

describe("getConfig", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("uses config values from the provided config file", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = { "foo-module": { foo: "bar" } };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("returns default values from the schema", async () => {
    Config.defineConfigSchema("testmod", {
      foo: {
        default: "qux"
      }
    });
    const config = await Config.getConfig("testmod");
    expect(config.foo).toBe("qux");
  });

  it("requires config values to have been defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    await expect(Config.getConfig("foo-module")).rejects.toThrow(/schema/);
  });

  it("requires nested config values to have been defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { default: "qux" } }
    });
    Config.provide({ "foo-module": { foo: { doof: "nope" } } });
    await expect(Config.getConfig("foo-module")).rejects.toThrowError(
      /foo\.doof.*schema/
    );
  });

  it("throws if looking up module with no schema", async () => {
    await expect(Config.getConfig("fake-module")).rejects.toThrow(
      /schema.*defined/
    );
  });

  it("returns a nested configuration", async () => {
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
    const config = await Config.getConfig("foo-module");
    expect(config.foo.bar).toBe(0);
    expect(config.foo.baz.qux).toBe("N/A");
    expect(config.foo.baz.quy).toBe("xyz");
  });

  it("works for multiple modules", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.defineConfigSchema("bar-module", { bar: { default: "quinn" } });
    const testConfig = { "bar-module": { bar: "baz" } };
    Config.provide(testConfig);
    const fooConfig = Config.getConfig("foo-module");
    await expect(fooConfig).resolves.toHaveProperty("foo", "qux");
    const barConfig = Config.getConfig("bar-module");
    await expect(barConfig).resolves.toHaveProperty("bar", "baz");
  });

  it("validates config values", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: "thing",
        validators: [
          validator(val => val.startsWith("thi"), "must start with 'thi'")
        ]
      }
    });
    const testConfig = {
      "foo-module": {
        foo: "bar"
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /bar.*foo.*must start with 'thi'.*/
    );
  });

  it("validators pass", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: "thing",
        validators: [
          validator(val => val.startsWith("thi"), "must start with 'thi'")
        ]
      }
    });
    const testConfig = {
      "foo-module": {
        foo: "this"
      }
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("this");
  });

  it("supports array elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: [1, 2, 3]
      }
    });
    const testConfig = {
      "foo-module": {
        foo: [0, 2, 4]
      }
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toStrictEqual([0, 2, 4]);
  });

  it("supports validation of array elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: [1, 2, 3],
        arrayElements: {
          validators: [validator(Number.isInteger, "must be an integer")]
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: [0, 1.5, "bad"]
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /must be an integer/
    );
  });

  it("supports validating structure of array element objects", async () => {
    Config.defineConfigSchema("foo-module", {
      bar: {
        baz: {
          default: [{ a: 0, b: 1 }],
          arrayElements: {
            a: {},
            b: {}
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        bar: { baz: [{ a: 1, b: 2 }, { a: 3, b: 4, dingo: 5 }] }
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /bar.baz.*element #2.*dingo.*schema/
    );
  });
});

describe("resolveImportMapConfig", () => {
  afterEach(() => {
    Config.clearAll();
    (<any>window).System.resolve.mockReset();
    (<any>window).System.import.mockReset();
  });

  it("gets config file from import map", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve = jest.fn();
    (<any>window).System.import = jest.fn().mockResolvedValue(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("always puts config file from import map at lowest priority", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const importedConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve = jest.fn();
    (<any>window).System.import = jest.fn().mockResolvedValue(importedConfig);
    const providedConfig = { "foo-module": { foo: "baz" } };
    Config.provide(providedConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("baz");
  });

  it("does not 404 when no config file is in the import map", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    // this line below is actually all that the test requires, the rest is sanity checking
    expect(() => Config.getConfig("foo-module")).not.toThrow();
  });
});

const importableConfig = configObject => ({ default: configObject });
