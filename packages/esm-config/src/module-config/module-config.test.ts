import * as Config from "./module-config";
import { validator } from "../validators/validator";
import { validators, isString } from "../validators/validators";

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

  it("doesn't mind higher-level description and validator keys", () => {
    const schema = {
      foo: {
        description: "Composed of bar and baz.",
        validators: [
          validator(f => f.bar != f.baz, "bar and baz must not be equal")
        ],
        bar: {
          default: 0
        },
        baz: {
          default: 1
        }
      }
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("logs an error if a non-function validator is provided", () => {
    const schema = {
      bar: { validators: [false] }
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /foo-module.*has invalid validator.*bar[\s\S]*false.*/i
      )
    );
  });

  it("logs an error if an unexpected value nested in an array is provided as a key", () => {
    const schema = {
      foo: {
        default: [],
        arrayElements: { bar: "bad" }
      }
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo.*bar/)
    );
  });

  it("logs an error if any key does not include a default", () => {
    const schema = {
      foo: { bar: { description: "lol idk" } }
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo\.bar[\s\S]*default/)
    );
  });

  it("logs an error if any key is empty", () => {
    const schema = {
      foo: { bar: {} }
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo\.bar[\s\S]*default/)
    );
  });

  it("does not log an error if an arrayElement object has a key without a default", () => {
    const schema = {
      foo: {
        default: [],
        arrayElements: {
          bar: {}
        }
      }
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).not.toHaveBeenCalled();
  });
});

describe("getConfig", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

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

  it("returns devDefault values when defined when turned on", async () => {
    Config.setAreDevDefaultsOn(true);
    Config.defineConfigSchema("testmod", {
      foo: {
        default: "qux"
      },
      bar: {
        default: "pub",
        devDefault: "barcade"
      }
    });
    const config = await Config.getConfig("testmod");
    expect(config.foo).toBe("qux");
    expect(config.bar).toBe("barcade");
    Config.setAreDevDefaultsOn(false);
  });

  it("logs an error if config values not defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/Unknown.*key.*foo-module.*bar/)
    );
  });

  it("validates the values in object elements against the schema", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { default: "qux" } }
    });
    Config.provide({ "foo-module": { foo: { doof: "nope" } } });
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*foo\.doof.*/)
    );
  });

  it("supports running validators on nested objects", async () => {
    const fooSchema = {
      bar: {
        a: { default: { b: 1 } },
        c: { default: 2 },
        diff: { default: 1 },
        validators: [
          validator(o => o.a.b + o.diff == o.c, "c must equal a.b + diff")
        ]
      }
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        bar: { a: { b: 5 } }
      }
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /value.*{\"a\":{\"b\":5}\}.*foo-module.bar.*c must equal a\.b \+ diff/
      )
    );
    Config.clearAll();
    Config.defineConfigSchema("foo-module", fooSchema);
    const goodConfig = { "foo-module": { bar: { a: { b: 0 }, diff: 2 } } };
    Config.provide(goodConfig);
    const result = await Config.getConfig("foo-module");
    expect(result.bar.a.b).toBe(0);
    expect(result.bar.c).toBe(2);
    expect(result.bar.diff).toBe(2);
  });

  it("supports freeform object elements, which have no structural validation", async () => {
    const fooSchema = {
      baz: {
        default: {},
        validators: [
          validator(
            o => typeof o === "object" && !Array.isArray(o),
            "Must be an object"
          )
        ]
      }
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const testConfig = {
      "foo-module": {
        baz: { what: "ever", goes: "here" }
      }
    };
    Config.provide(testConfig);
    const result = await Config.getConfig("foo-module");
    expect(console.error).not.toHaveBeenCalled();
    expect(result.baz.what).toBe("ever");

    Config.clearAll();
    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        baz: 0
      }
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/0.*foo-module.*baz.*must be an object/i)
    );
  });

  it("throws if looking up module with no schema", async () => {
    await expect(Config.getConfig("fake-module")).rejects.toThrow(
      /No config schema has been defined.*fake-module/
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

  it("works for multiple modules and multiple provides", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.defineConfigSchema("bar-module", { bar: { default: "quinn" } });
    Config.defineConfigSchema("baz-module", { baz: { default: "quip" } });
    const barTestConfig = { "bar-module": { bar: "barrr" } };
    const bazTestConfig = { "baz-module": { baz: "bazzz" } };
    Config.provide(barTestConfig);
    Config.provide(bazTestConfig);
    const fooConfig = Config.getConfig("foo-module");
    await expect(fooConfig).resolves.toHaveProperty("foo", "qux");
    const barConfig = Config.getConfig("bar-module");
    await expect(barConfig).resolves.toHaveProperty("bar", "barrr");
    const bazConfig = Config.getConfig("baz-module");
    await expect(bazConfig).resolves.toHaveProperty("baz", "bazzz");
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
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/bar.*foo.*must start with 'thi'.*/)
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

  it("supports dictionary elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: {
          a: {
            name: "A"
          },
          b: {
            name: "B"
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: {
          c: {
            name: "C"
          }
        }
      }
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toStrictEqual({
      c: {
        name: "C"
      }
    });
  });

  it("supports dictionary elements validations", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        dictionaryElements: {
          name: { validators: [isString] }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: {
          b: {
            name: "B"
          },
          c: {
            name: 1
          }
        }
      }
    };
    Config.provide(testConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.foo.c.name: must be a string/)
    );
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
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/1\.5.*foo-module.*foo\[1\].*must be an integer/)
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
        bar: {
          baz: [
            { a: 1, b: 2 },
            { a: 3, b: 4, dingo: 5 }
          ]
        }
      }
    };
    Config.provide(testConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/key.*foo-module.*bar\.baz\[1\]\.dingo/)
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
        bar: {
          baz: [
            { a: 1, b: 2 },
            { a: 3, b: { dingo: 5 } }
          ]
        }
      }
    };
    Config.provide(testConfig);
    await expect(Config.getConfig("foo-module")).rejects.toThrow(); // throws incidentally
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/key.*foo-module.*bar\.baz\[1\]\.b\.dingo/)
    );
  });

  it("supports validation of nested array element objects elements", async () => {
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
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/value.*foo\[0\]\.a\.b.*must be an integer/)
    );
  });

  it("supports validation of array element objects", async () => {
    const fooSchema = {
      bar: {
        default: [{ a: { b: 1 }, c: 2 }],
        arrayElements: {
          validators: [validator(o => o.a.b + 1 == o.c, "c must equal a.b + 1")]
        }
      }
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        bar: [
          { a: { b: 4 }, c: 5 },
          { a: { b: 1 }, c: 3 }
        ]
      }
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /value.*{\"a\":{\"b\":1},\"c\":3}.*foo-module.bar\[1\].*c must equal a\.b \+ 1/
      )
    );
    Config.clearAll();
    Config.defineConfigSchema("foo-module", fooSchema);
    const goodConfig = { "foo-module": { bar: [{ a: { b: 2 }, c: 3 }] } };
    Config.provide(goodConfig);
    const result = await Config.getConfig("foo-module");
    expect(result.bar[0].a.b).toBe(2);
  });

  it("fills array element object elements with defaults", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        default: [{ a: { b: "arrayDefaultB", filler: "arrayDefault" } }],
        arrayElements: {
          a: {
            b: { validators: [] },
            filler: { default: "defaultFiller", validators: [isString] }
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: [
          { a: { b: "customB", filler: "customFiller" } },
          { a: { b: "anotherB" } }
        ]
      }
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toStrictEqual([
      { a: { b: "customB", filler: "customFiller" } },
      { a: { b: "anotherB", filler: "defaultFiller" } }
    ]);
  });
});

describe("resolveImportMapConfig", () => {
  beforeEach(() => {
    Config.clearAll();
    (<any>window).System.resolve.mockImplementation(() => {
      throw new Error("config.json not available in import map");
    });
    (<any>window).System.import.mockReset();
  });

  afterAll(() => {
    Config.clearAll();
  });

  it("gets config file from import map", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve.mockReturnValue(true);
    (<any>window).System.import.mockResolvedValue(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("always puts config file from import map at highest priority", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const importedConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve.mockReturnValue(true);
    (<any>window).System.import.mockResolvedValue(importedConfig);
    const providedConfig = { "foo-module": { foo: "baz" } };
    Config.provide(providedConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("does not 404 when no config file is in the import map", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    // this line below is actually all that the test requires, the rest is sanity checking
    expect(() => Config.getConfig("foo-module")).not.toThrow();
  });
});

describe("processConfig", () => {
  it("validates a config object", () => {
    const schema = {
      foo: {
        default: false,
        validators: [validators.isBoolean]
      }
    };
    const inputConfig = {
      foo: "fAlSe"
    };
    const config = Config.processConfig(schema, inputConfig, "nowhere");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/nowhere\.foo.*boolean/)
    );
    expect(config.foo).toBe("fAlSe");
  });

  it("interpolates defaults", () => {
    const schema = {
      foo: { default: false }
    };
    const inputConfig = {};
    const config = Config.processConfig(schema, inputConfig, "nowhere");
    expect(config.foo).toBe(false);
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

describe("temporary config", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("allows overriding the existing config", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = { "foo-module": { foo: "baz" } };
    Config.provide(testConfig);
    Config.setTemporaryConfigValue(["foo-module", "foo"], 3);
    expect(Config.getTemporaryConfig()).toStrictEqual({
      "foo-module": { foo: 3 }
    });
    let config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: 3 });
    Config.unsetTemporaryConfigValue(["foo-module", "foo"]);
    config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: "baz" });
  });

  it("can be gotten and cleared", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.setTemporaryConfigValue(["foo-module", "foo"], 3);
    expect(Config.getTemporaryConfig()).toStrictEqual({
      "foo-module": { foo: 3 }
    });
    Config.clearTemporaryConfig();
    expect(Config.getTemporaryConfig()).toStrictEqual({});
    const config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: "qux" });
  });

  it("is not mutated by getConfig", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        bar: { default: "qux" },
        baz: { default: "also qux" }
      }
    });
    await Config.getConfig("foo-module");
    Config.setTemporaryConfigValue(["foo-module", "foo", "bar"], 3);
    await Config.getConfig("foo-module");
    Config.setTemporaryConfigValue(["foo-module", "foo", "bar"], 4);
    expect(Config.getTemporaryConfig()).toStrictEqual({
      "foo-module": { foo: { bar: 4 } }
    });
  });
});

const importableConfig = configObject => ({ default: configObject });
