import * as Config from "./module-config";
import { validator } from "../validators/validator";
import { validators } from "../validators/validators";

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
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /foo-module.*bar/
    );
  });

  it("requires nested config values to have been defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { default: "qux" } }
    });
    Config.provide({ "foo-module": { foo: { doof: "nope" } } });
    await expect(Config.getConfig("foo-module")).rejects.toThrowError(
      /foo-module.*foo\.doof.*/
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

    // TEST CASE 2: One that bugs out for multiple modules: see conversation on:
    // https://github.com/openmrs/openmrs-esm-module-config/pull/18
    // This example fails because the merge function https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L107
    // introduces undefined into the final merged configs array i.e [ workingconfig, undefined ]
    Config.clearAll();
    Config.defineConfigSchema("@openmrs/esm-patient-chart", {
      defaultTabIndex: {
        default: 0
      }
    });
    Config.defineConfigSchema("@openmrs/esm-login", {
      logo: {
        src: {
          default: null
        }
      }
    });

    const login = {
      "@openmrs/esm-login": {
        logo: {
          src: "https://ampath-poc.fra1.digitaloceanspaces.com/ampath.png"
        }
      }
    };

    const patientChart = {
      "@openmrs/esm-patient-chart": {
        defaultTabIndex: 0
      }
    };

    Config.provide(login);
    Config.provide(patientChart);
    const loginConfig = Config.getConfig("@openmrs/esm-login");
    const patientConfig = Config.getConfig("@openmrs/esm-patient-chart");
    await expect(loginConfig).resolves.toHaveProperty("logo");
    await expect(patientConfig).resolves.toHaveProperty("defaultTabIndex");
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
      /1\.5.*foo-module.*foo.*must be an integer/
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
      /key.*foo-module.*bar\.baz\[1\]\.dingo/
    );
  });

  it("supports validating structure of array element nested objects", async () => {
    Config.defineConfigSchema("foo-module", {
      bar: {
        baz: {
          default: [{ a: 0, b: { c: 2 } }],
          arrayElements: {
            a: {},
            b: { c: {} }
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        bar: { baz: [{ a: 1, b: 2 }, { a: 3, b: { dingo: 5 } }] }
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /key.*foo-module.*bar\.baz\[1\]\.b\.dingo/
    );
  });

  it("supports validation of nested array element objects", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: [{ a: { b: 1 } }],
        arrayElements: {
          a: {
            b: {
              validators: [validator(Number.isInteger, "must be an integer")]
            }
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: [{ a: { b: 0.2 } }]
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(
      /value.*foo\[0\]\.a\.b.*must be an integer/
    );
  });
});

describe("resolveImportMapConfig", () => {
  afterEach(() => {
    Config.clearAll();
    (<any>window).System.resolve.mockImplementation(() => {
      throw new Error("config.json not available in import map");
    });
    (<any>window).System.import.mockReset();
  });

  it("gets config file from import map", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve.mockReturnValue(true);
    (<any>window).System.import.mockResolvedValue(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("always puts config file from import map at lowest priority", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const importedConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve.mockReturnValue(true);
    (<any>window).System.import.mockResolvedValue(importedConfig);
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

describe("getDevtoolsConfig", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("returns the full config tree", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.defineConfigSchema("bar-module", { bar: { default: "quinn" } });
    const testConfig = { "bar-module": { bar: "baz" } };
    Config.provide(testConfig);
    const devConfig = await Config.getDevtoolsConfig();
    expect(devConfig).toHaveProperty("foo-module", { foo: "qux" });
    expect(devConfig).toHaveProperty("bar-module", { bar: "baz" });
  });
});

const importableConfig = configObject => ({ default: configObject });
