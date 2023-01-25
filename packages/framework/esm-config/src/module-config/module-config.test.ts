import unset from "lodash/unset";
import * as Config from "./module-config";
import {
  MockedStore,
  mockStores,
} from "../../__mocks__/openmrs-esm-state.mock";
import { validator } from "../validators/validator";
import { validators, isUrl } from "../validators/validators";
import {
  ConfigExtensionStore,
  configExtensionStore,
  ConfigInternalStore,
  configInternalStore,
  getExtensionConfig,
  ImplementerToolsConfigStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
} from "./state";
import { Type } from "../types";
import { getExtensionSlotsConfigStore } from "..";

const mockConfigInternalStore =
  configInternalStore as MockedStore<ConfigInternalStore>;
const mockTemporaryConfigStore = temporaryConfigStore as MockedStore<object>;
const mockImplementerToolsConfigStore =
  implementerToolsConfigStore as MockedStore<ImplementerToolsConfigStore>;
const mockConfigExtensionStore =
  configExtensionStore as MockedStore<ConfigExtensionStore>;

async function resetAll() {
  mockConfigInternalStore.resetMock();
  mockTemporaryConfigStore.resetMock();
  mockImplementerToolsConfigStore.resetMock();
  mockConfigExtensionStore.resetMock();
  for (let storeName of Object.keys(mockStores)) {
    if (storeName.startsWith("config-module-")) {
      delete mockStores[storeName];
    } else if (storeName.startsWith("config-extension-slots-")) {
      delete mockStores[storeName];
    } else if (storeName.startsWith("config-extension-")) {
      delete mockStores[storeName];
    }
  }
}

describe("defineConfigSchema", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  it("logs an error if a non-object value is provided as a config element definition", () => {
    const schema = {
      bar: true,
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*bar/)
    );
  });

  it("logs an error if a nested non-object value is provided as a config element definition", () => {
    const schema = {
      bar: { baz: "bad bad bad" },
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*bar\.baz/)
    );
  });

  it("logs an error if an invalid type is provided", () => {
    const schema = {
      bar: { _default: 0, _type: "numeral" },
    };
    //@ts-ignore
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.*bar[\s\S]*Number.*numeral/i)
    );
  });

  it("doesn't mind higher-level description and validator keys", () => {
    const schema = {
      foo: {
        _description: "Composed of bar and baz.",
        _validators: [
          validator((f) => f.bar != f.baz, "bar and baz must not be equal"),
        ],
        bar: {
          _default: 0,
        },
        baz: {
          _default: 1,
        },
      },
    };
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("runs top-level validators on filled-in config", () => {
    const schema = {
      foo: {
        _type: Type.String,
        _default: "bar-value",
      },
      fooStart: {
        _type: Type.String,
        _default: "bar",
      },
      _validators: [
        validator(
          (v) => v.foo.startsWith(v.fooStart),
          (v) =>
            `The value of \`foo\` must start with the value of \`fooStart\` (which is ${v.fooStart}).`
        ),
      ],
    };
    Config.defineConfigSchema("foo-module", schema);
    Config.provide({ "foo-module": { foo: "different" } });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /The value of `foo` must start with the value of `fooStart`.*bar/
      )
    );
  });

  it("logs an error if a non-function validator is provided", () => {
    const schema = {
      bar: { _default: [], _validators: [false] },
    };
    //@ts-ignore
    Config.defineConfigSchema("foo-module", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /foo-module.*has invalid validator.*bar[\s\S]*false.*/i
      )
    );
  });

  it("logs an error if non-object value is provided as a config element definition within an array", () => {
    const schema = {
      foo: {
        _default: [],
        _type: Type.Array,
        _elements: { bar: "bad" },
      },
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo.*bar/)
    );
  });

  it("logs an error if elements key is provided without type being 'Array' or 'Object'", () => {
    const schema = {
      foo: {
        _default: [],
        _type: Type.Boolean,
        _elements: {},
      },
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo[\s\S]*elements.*Boolean/)
    );
  });

  it("logs an error if any key does not include a default", () => {
    const schema = {
      foo: { bar: { _description: "lol idk" } },
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo\.bar[\s\S]*default/)
    );
  });

  it("logs an error if any key is empty", () => {
    const schema = {
      foo: { bar: {} },
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*foo\.bar[\s\S]*default/)
    );
  });

  it("does not log an error if an array elements object has a key without a default", () => {
    const schema = {
      foo: {
        _default: [],
        _type: Type.Array,
        _elements: {
          bar: {},
        },
      },
    };
    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("logs an error if the schema attempts to include a key named 'Display conditions'", () => {
    const schema = {
      "Display conditions": {
        _type: Type.Array,
        _default: [],
      },
    };

    Config.defineConfigSchema("mod-mod", schema);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/mod-mod.*\bDisplay conditions\b/)
    );
  });
});

describe("getConfig", () => {
  beforeAll(resetAll);

  beforeEach(async () => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  it("uses config values from the provided config file", async () => {
    Config.defineConfigSchema("foo-module", { foo: { _default: "qux" } });
    const testConfig = { "foo-module": { foo: "bar" } };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("returns default values from the schema", async () => {
    Config.defineConfigSchema("testmod", {
      foo: {
        _default: "qux",
      },
    });
    const config = await Config.getConfig("testmod");
    expect(config.foo).toBe("qux");
  });

  it("logs an error if config values not defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", { foo: { _default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/Unknown.*key.*foo-module.*bar/)
    );
  });

  it("validates the structure of the config tree", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { _default: "qux" } },
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
        a: { _default: { b: 1 } },
        c: { _default: 2 },
        diff: { _default: 1 },
        _validators: [
          validator((o) => o.a.b + o.diff == o.c, "c must equal a.b + diff"),
        ],
      },
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        bar: { a: { b: 5 } },
      },
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /Invalid configuration for foo-module.bar.*c must equal a\.b \+ diff/
      )
    );

    await resetAll();

    Config.defineConfigSchema("foo-module", fooSchema);
    const goodConfig = { "foo-module": { bar: { a: { b: 0 }, diff: 2 } } };
    Config.provide(goodConfig);
    const result = await Config.getConfig("foo-module");
    expect(result).toStrictEqual({
      bar: {
        a: { b: 0 },
        c: 2,
        diff: 2,
      },
    });
  });

  // DISABLED: Presently getConfig *does not resolve* when looking up a module
  //   with no schema. The behavior described in this test would be preferable,
  //   but would require some deeper changes.
  xit("throws if looking up module with no schema", async () => {
    await expect(Config.getConfig("fake-module")).rejects.toThrow(
      /No config schema has been defined.*fake-module/
    );
  });

  it("returns a nested configuration", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        bar: {
          _default: -1,
        },
        baz: {
          qux: {
            _default: "N/A",
          },
          quy: {
            _default: "",
          },
        },
      },
    });
    const testConfig = {
      "foo-module": {
        foo: {
          bar: 0,
          baz: {
            quy: "xyz",
          },
        },
      },
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo.bar).toBe(0);
    expect(config.foo.baz.qux).toBe("N/A");
    expect(config.foo.baz.quy).toBe("xyz");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("works for multiple modules and multiple provides", async () => {
    Config.defineConfigSchema("foo-module", { foo: { _default: "qux" } });
    Config.defineConfigSchema("bar-module", { bar: { _default: "quinn" } });
    Config.defineConfigSchema("baz-module", { baz: { _default: "quip" } });
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
    expect(console.error).not.toHaveBeenCalled();
  });

  it("validates config values", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _default: "thing",
        _validators: [
          validator((val) => val.startsWith("thi"), "must start with 'thi'"),
        ],
      },
    });
    const testConfig = {
      "foo-module": {
        foo: "bar",
      },
    };
    Config.provide(testConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/bar.*foo.*must start with 'thi'.*/)
    );
  });

  it("tolerates defaults that don't pass validation", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _default: null,
        _validators: [
          validator((val) => val.startsWith("thi"), "must start with 'thi'"),
        ],
      },
    });
    await Config.getConfig("foo-module");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("validators pass", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _default: "thing",
        _validators: [
          validator((val) => val.startsWith("thi"), "must start with 'thi'"),
        ],
      },
    });
    const testConfig = {
      "foo-module": {
        foo: "this",
      },
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toBe("this");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("supports freeform object elements, which have no structural validation", async () => {
    const fooSchema = {
      baz: {
        _type: Type.Object,
        _default: {},
      },
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const testConfig = {
      "foo-module": {
        baz: { what: "ever", goes: "here" },
      },
    };
    Config.provide(testConfig);
    const result = await Config.getConfig("foo-module");
    expect(console.error).not.toHaveBeenCalled();
    expect(result.baz.what).toBe("ever");

    await resetAll();

    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        baz: 0,
      },
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/0.*foo-module.*baz.*must be an object/i)
    );
  });

  it("supports freeform object elements validations", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _type: Type.Object,
        _elements: {
          name: { _validators: [isUrl] },
        },
        _default: {},
      },
    });
    const testConfig = {
      "foo-module": {
        foo: {
          b: {
            name: "B",
          },
          c: {
            name: 1,
          },
        },
      },
    };
    Config.provide(testConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.foo.c.name: .*url/i)
    );
  });

  it("returns freeform object default", async () => {
    Config.defineConfigSchema("object-def", {
      furi: {
        _type: Type.Object,
        _elements: { gohan: { _type: Type.String } },
        _default: { kake: { gohan: "ok" } },
      },
    });
    const config = await Config.getConfig("object-def");
    expect(config).toStrictEqual({
      furi: { kake: { gohan: "ok" } },
    });
  });

  it("interpolates freeform object element defaults", async () => {
    Config.defineConfigSchema("object-def", {
      tamago: {
        _type: Type.Object,
        _elements: {
          gohan: { _type: Type.String },
          nori: { _type: Type.Boolean, _default: true },
        },
        _default: {
          kake: { gohan: "ok", nori: true },
        },
      },
    });
    Config.provide({
      "object-def": {
        tamago: {
          gyudon: { gohan: "no" },
          sake: { gohan: "maybe", nori: false },
        },
      },
    });
    const config = await Config.getConfig("object-def");
    expect(config).toStrictEqual({
      tamago: {
        gyudon: { gohan: "no", nori: true },
        sake: { gohan: "maybe", nori: false },
      },
    });
  });

  it("supports array elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _default: [1, 2, 3],
      },
    });
    const testConfig = {
      "foo-module": {
        foo: [0, 2, 4],
      },
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toStrictEqual([0, 2, 4]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("supports array of string elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _type: Type.Array,
        _default: ["bar"],
        _elements: {
          _type: Type.String,
        },
      },
    });
    const testConfig = {
      "foo-module": {
        foo: ["bar", "baz", "qux"],
      },
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("foo-module");
    expect(config.foo).toStrictEqual(["bar", "baz", "qux"]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("supports validation of array elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _type: Type.Array,
        _default: [1, 2, 3],
        _elements: {
          _validators: [validator(Number.isInteger, "must be an integer")],
        },
      },
    });
    const testConfig = {
      "foo-module": {
        foo: [0, 1.5, "bad"],
      },
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
          _default: [{ a: 0, b: 1 }],
          _type: Type.Array,
          _elements: {
            a: {},
            b: {},
          },
        },
      },
    });
    const testConfig = {
      "foo-module": {
        bar: {
          baz: [
            { a: 1, b: 2 },
            { a: 3, b: 4, dingo: 5 },
          ],
        },
      },
    };
    Config.provide(testConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/key.*foo-module.*bar\.baz\[1\]\.dingo/)
    );
  });

  it("supports validating structure of array element nested objects", async () => {
    const configSchema = {
      yoshi: {
        nori: {
          _default: [{ a: 0, b: { c: 2 } }],
          _type: Type.Array,
          _elements: {
            a: {},
            b: { c: {} },
          },
        },
      },
    };
    Config.defineConfigSchema("array-nest", configSchema);
    const testConfig = {
      "array-nest": {
        yoshi: {
          nori: [
            { a: 1, b: { c: 1 } },
            { a: 3, b: { shi: 5 } },
          ],
        },
      },
    };
    Config.provide(testConfig);
    await Config.getConfig("array-nest");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/key.*array-nest.*yoshi\.nori\[1\]\.b\.shi/)
    );
  });

  it("supports validation of nested array element objects elements", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        _default: [{ a: { b: 1 } }],
        _type: Type.Array,
        _elements: {
          a: {
            b: {
              _validators: [validator(Number.isInteger, "must be an integer")],
            },
          },
        },
      },
    });
    const testConfig = {
      "foo-module": {
        foo: [{ a: { b: 0.2 } }],
      },
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
        _default: [{ a: { b: 1 }, c: 2 }],
        _type: Type.Array,
        _elements: {
          _validators: [
            validator((o) => o.a.b + 1 == o.c, "c must equal a.b + 1"),
          ],
        },
      },
    };
    Config.defineConfigSchema("foo-module", fooSchema);
    const badConfig = {
      "foo-module": {
        bar: [
          { a: { b: 4 }, c: 5 },
          { a: { b: 1 }, c: 3 },
        ],
      },
    };
    Config.provide(badConfig);
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/foo-module.bar\[1\].*c must equal a\.b \+ 1/i)
    );

    await resetAll();

    Config.defineConfigSchema("foo-module", fooSchema);
    const goodConfig = { "foo-module": { bar: [{ a: { b: 2 }, c: 3 }] } };
    Config.provide(goodConfig);
    const result = await Config.getConfig("foo-module");
    expect(result.bar[0].a.b).toBe(2);
  });

  it("fills array element object elements with defaults", async () => {
    Config.defineConfigSchema("array-def", {
      foo: {
        _default: [{ a: { b: "arrayDefaultB", filler: "arrayDefault" } }],
        _type: Type.Array,
        _elements: {
          a: {
            b: { _validators: [] },
            filler: { _default: "defaultFiller", _validators: [isUrl] },
          },
        },
      },
    });
    const testConfig = {
      "array-def": {
        foo: [
          { a: { b: "customB", filler: "customFiller" } },
          { a: { b: "anotherB" } },
        ],
      },
    };
    Config.provide(testConfig);
    const config = await Config.getConfig("array-def");
    expect(config.foo).toStrictEqual([
      { a: { b: "customB", filler: "customFiller" } },
      { a: { b: "anotherB", filler: "defaultFiller" } },
    ]);
    expect(console.error).not.toHaveBeenCalled();
  });
});

describe("type validations", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  test.each([
    [Type.Array, "doop"],
    [Type.Boolean, 0],
    [Type.ConceptUuid, "Weight"],
    [Type.Number, "foo"],
    [Type.Object, []],
    [Type.String, 0],
    [Type.UUID, "not-valid"],
  ])("validates %s type", async (configType, badValue) => {
    Config.defineConfigSchema("foo-module", {
      foo: { _default: "qux", _type: configType },
    });
    Config.provide({ "foo-module": { foo: badValue } });
    await Config.getConfig("foo-module");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`${badValue}.*foo-module.*foo`, "i"))
    );
  });
});

describe("processConfig", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  it("validates a config object", () => {
    const schema = {
      abe: {
        _default: "www.google.com",
        _validators: [validators.isUrl],
      },
    };
    const inputConfig = {
      abe: true,
    };
    const config = Config.processConfig(schema, inputConfig, "nowhere");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/true.*nowhere\.abe.*url/i)
    );
    expect(config.abe).toBe(true);
  });

  it("interpolates defaults", () => {
    const schema = {
      foo: { _default: false },
    };
    const inputConfig = {};
    const config = Config.processConfig(schema, inputConfig, "nowhere");
    expect(config.foo).toBe(false);
    expect(console.error).not.toHaveBeenCalled();
  });
});

describe("implementer tools config", () => {
  afterEach(resetAll);

  it("returns all config schemas, with values and sources interpolated", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { _default: "qux", _description: "All the foo", _validators: [] },
    });
    Config.defineConfigSchema("bar-module", { bar: { _default: "quinn" } });
    const testConfig = { "bar-module": { bar: "baz" } };
    Config.provide(testConfig, "my config source");
    const devConfig = implementerToolsConfigStore.getState().config;
    expect(devConfig).toStrictEqual({
      "foo-module": {
        foo: {
          _value: "qux",
          _source: "default",
          _default: "qux",
          _description: "All the foo",
          _validators: [],
        },
        "Display conditions": {
          privileges: {
            _default: [],
            _description:
              "The privilege(s) the user must have to use this extension",
            _source: "default",
            _type: Type.Array,
            _value: [],
          },
        },
        "Translation overrides": {
          _default: {},
          _description:
            "Per-language overrides for frontend translations should be keyed by language code and each language dictionary contains the translation key and the display value",
          _source: "default",
          _type: Type.Object,
          _value: {},
        },
      },
      "bar-module": {
        bar: { _value: "baz", _source: "my config source", _default: "quinn" },
        "Display conditions": {
          privileges: {
            _default: [],
            _description:
              "The privilege(s) the user must have to use this extension",
            _source: "default",
            _type: Type.Array,
            _value: [],
          },
        },
        "Translation overrides": {
          _default: {},
          _description:
            "Per-language overrides for frontend translations should be keyed by language code and each language dictionary contains the translation key and the display value",
          _source: "default",
          _type: Type.Object,
          _value: {},
        },
      },
    });
  });
});

describe("temporary config", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  it("allows overriding the existing config", async () => {
    Config.defineConfigSchema("foo-module", { foo: { _default: "qux" } });
    const testConfig = { "foo-module": { foo: "baz" } };
    Config.provide(testConfig);
    temporaryConfigStore.setState({ config: { "foo-module": { foo: 3 } } });
    expect(temporaryConfigStore.getState().config).toStrictEqual({
      "foo-module": { foo: 3 },
    });
    let config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: 3 });
    temporaryConfigStore.setState({
      config: unset(temporaryConfigStore.getState(), [
        "foo-module",
        "foo",
      ]) as any,
    });
    config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: "baz" });
  });

  it("can be gotten and cleared", async () => {
    Config.defineConfigSchema("foo-module", { foo: { _default: "qux" } });
    temporaryConfigStore.setState({ config: { "foo-module": { foo: 3 } } });
    expect(temporaryConfigStore.getState().config).toStrictEqual({
      "foo-module": { foo: 3 },
    });
    temporaryConfigStore.setState({ config: {} });
    expect(temporaryConfigStore.getState()).toStrictEqual({ config: {} });
    const config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: "qux" });
  });

  it("is not mutated by getConfig", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        bar: { _default: "qux" },
        baz: { _default: "also qux" },
      },
    });
    await Config.getConfig("foo-module");
    temporaryConfigStore.setState({
      config: { "foo-module": { foo: { bar: 3 } } },
    });
    await Config.getConfig("foo-module");
    temporaryConfigStore.setState({
      config: { "foo-module": { foo: { bar: 4 } } },
    });
    expect(temporaryConfigStore.getState().config).toStrictEqual({
      "foo-module": { foo: { bar: 4 } },
    });
  });
});

describe("extension slot config", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(resetAll);

  it("returns an object with add, remove, and order keys. No schema needs to be defined", async () => {
    // TODO: Here's the problem: right now extension slot configs are computed only for
    // modules that define schemas.
    Config.provide({
      "foo-module": {
        extensionSlots: {
          fooSlot: {
            add: ["bar", "baz"],
            remove: ["zap"],
            order: ["qux", "baz", "bar"],
            configure: { bar: { a: 0 } },
          },
        },
      },
    });
    const { config } =
      getExtensionSlotsConfigStore().getState().slots["fooSlot"];
    expect(config).toStrictEqual({
      add: ["bar", "baz"],
      remove: ["zap"],
      order: ["qux", "baz", "bar"],
      configure: {
        bar: {
          a: 0,
        },
      },
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("doesn't get returned by getConfig", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { _default: 0 },
    });
    Config.provide({
      "foo-module": {
        extensionSlots: { fooSlot: { remove: ["bar"] } },
      },
    });
    const config = await Config.getConfig("foo-module");
    expect(config).toStrictEqual({ foo: 0 });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("isn't mutated by getConfig", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { _default: 0 },
    });
    Config.provide({
      "foo-module": {
        extensionSlots: { fooSlot: { remove: ["bar"] } },
      },
    });
    await Config.getConfig("foo-module");
    const { config } =
      getExtensionSlotsConfigStore().getState().slots["fooSlot"];
    expect(config).toStrictEqual({ remove: ["bar"] });
  });

  it("is included in implementerToolsConfigStore", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { _default: 0 },
    });
    Config.provide({
      "foo-module": {
        extensionSlots: { fooSlot: { remove: ["bar"] } },
      },
    });
    const config = implementerToolsConfigStore.getState().config;
    expect(config).toStrictEqual({
      "foo-module": {
        foo: { _default: 0, _value: 0, _source: "default" },
        extensionSlots: {
          fooSlot: {
            remove: { _value: ["bar"], _source: "provided" },
          },
        },
        "Display conditions": {
          privileges: {
            _default: [],
            _description:
              "The privilege(s) the user must have to use this extension",
            _source: "default",
            _type: Type.Array,
            _value: [],
          },
        },
        "Translation overrides": {
          _default: {},
          _description:
            "Per-language overrides for frontend translations should be keyed by language code and each language dictionary contains the translation key and the display value",
          _source: "default",
          _type: Type.Object,
          _value: {},
        },
      },
    });
  });

  it("validates that no other keys are present for the slot", async () => {
    Config.provide({
      "foo-module": {
        extensionSlots: { fooSlot: { quitar: ["bar"] } },
      },
    });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /foo-module.extensionSlots.fooSlot.*invalid.*quitar/
      )
    );
  });
});

describe("extension config", () => {
  beforeEach(() => {
    console.error = jest.fn();
    Config.defineConfigSchema("ext-mod", {
      bar: { _default: "barry" },
      baz: { _default: "bazzy" },
    });
  });

  afterEach(resetAll);

  it("returns the module config", async () => {
    const moduleLevelConfig = { "ext-mod": { bar: "qux" } };
    updateConfigExtensionStore();
    Config.provide(moduleLevelConfig);
    const result = getExtensionConfig("barSlot", "fooExt").config;
    expect(result).toStrictEqual({ bar: "qux", baz: "bazzy" });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("uses the 'configure' config if one is present, with module config schema", () => {
    updateConfigExtensionStore("fooExt#id0");
    const configureConfig = {
      "ext-mod": { bar: "qux" },
      "slot-mod": {
        extensionSlots: {
          barSlot: {
            configure: { "fooExt#id0": { baz: "quiz" } },
          },
        },
      },
    };
    Config.provide(configureConfig);
    const result = getExtensionConfig("barSlot", "fooExt#id0").config;
    expect(result).toStrictEqual({ bar: "qux", baz: "quiz" });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("validates the extension configure config, with module config schema", () => {
    updateConfigExtensionStore("fooExt#id1");
    const badConfig = {
      "ext-mod": { bar: "qux" },
      "slot-mod": {
        extensionSlots: {
          barSlot: {
            configure: { "fooExt#id1": { beef: "bad" } },
          },
        },
      },
    };
    Config.provide(badConfig);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/unknown config key 'ext-mod.beef' provided.*/i)
    );
  });

  it("returns the extension config if an extension config schema is defined", async () => {
    updateConfigExtensionStore("fooExt");
    Config.defineExtensionConfigSchema("fooExt", {
      qux: { _default: "quxxy" },
    });
    const extensionAtBaseConfig = { fooExt: { qux: "quxolotl" } };
    Config.provide(extensionAtBaseConfig);
    const result = getExtensionConfig("barSlot", "fooExt").config;
    expect(result).toStrictEqual({ qux: "quxolotl" });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("uses the 'configure' config if one is present, with extension config schema", () => {
    updateConfigExtensionStore("fooExt#id2");
    Config.defineExtensionConfigSchema("fooExt", {
      qux: { _default: "quxxy" },
    });
    const configureConfig = {
      fooExt: { qux: "quxolotl" },
      "slot-mod": {
        extensionSlots: {
          barSlot: {
            configure: { "fooExt#id2": { qux: "quxotic" } },
          },
        },
      },
    };
    Config.provide(configureConfig);
    const result = getExtensionConfig("barSlot", "fooExt#id2").config;
    expect(result).toStrictEqual({ qux: "quxotic" });
  });

  it("validates the extension configure config, with extension config schema", () => {
    updateConfigExtensionStore("fooExt#id3");
    Config.defineExtensionConfigSchema("fooExt", {
      qux: { _default: "quxxy" },
    });
    const configureConfig = {
      "slot-mod": {
        extensionSlots: {
          barSlot: {
            configure: { "fooExt#id3": { no: "bad" } },
          },
        },
      },
    };
    Config.provide(configureConfig);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/unknown config key 'fooExt.no' provided.*/i)
    );
  });

  it("does not accept module config parameters for extension if extension config schema is defined", () => {
    Config.defineExtensionConfigSchema("fooExt", {
      qux: { _default: "quxxy" },
    });
    const badConfigNoModuleConfigsForExtension = {
      fooExt: {
        bar: "no good",
      },
    };
    Config.provide(badConfigNoModuleConfigsForExtension);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/unknown config key 'fooExt.bar' provided.*/i)
    );
  });

  it("does not accept extension config parameters for the module", () => {
    updateConfigExtensionStore("fooExt#id5");
    Config.defineExtensionConfigSchema("fooExt", {
      qux: { _default: "quxxy" },
    });
    const badConfigNoExtensionConfigsForModule = {
      "ext-mod": {
        qux: "also bad",
      },
    };
    Config.provide(badConfigNoExtensionConfigsForModule);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/unknown config key 'ext-mod.qux' provided.*/i)
    );
  });
});

function updateConfigExtensionStore(extensionId = "fooExt") {
  configExtensionStore.setState({
    mountedExtensions: [
      {
        slotModuleName: "slot-mod",
        extensionModuleName: "ext-mod",
        slotName: "barSlot",
        extensionId,
      },
    ],
  });
}
