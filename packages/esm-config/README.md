# openmrs-esm-config

[![npm: openmrs/esm-module-config](https://img.shields.io/npm/v/@openmrs/esm-config)](https://www.npmjs.com/package/@openmrs/esm-config)

## What is this?

This is the configuration library for
[OpenMRS Microfrontends](https://wiki.openmrs.org/display/projects/Frontend+-+SPA+and+Microfrontends).
It makes configurability easier for developers and configuring easier for
implementers.

## Contents

<!-- toc -->

- [What does an OpenMRS frontend configuration file look like?](#what-does-an-openmrs-frontend-configuration-file-look-like)
- [How do I configure my OpenMRS implementation?](#how-do-i-configure-my-openmrs-implementation)
- [I'm developing an ESM module. How do I make it configurable?](#im-developing-an-esm-module-how-do-i-make-it-configurable)
- [Reference: Schema definition](#schema-reference)
- [Reference: API](#api)
- [Contributing & Development](#contributing--development)

<!-- tocstop -->

## What does an OpenMRS frontend configuration file look like?

OpenMRS frontend configuration files are JSON files containing module names as top-level elements. All configuration elements are optional. The available configuration elements for each module should be documented in the module's wiki page.

Here's an example!

```json
{
  "@openmrs/esm-login-app": {
    "logo": {
      "src": "https://pbs.twimg.com/media/C1w_czvWgAAWONL.jpg"
    }
  },
  "@openmrs/esm-home-app": {
    "buttons": {
      "enabled": false
    }
  }
}
```

Alternatively you can provide your config file as a Javascript file.
It will look just about the same, but with some magic words at the beginning:

```js
exports = {};
exports.default = {
  "@openmrs/esm-login-app": {
    logo: {
      src: "https://pbs.twimg.com/media/C1w_czvWgAAWONL.jpg"
    }
  },
  "@openmrs/esm-home-app": {
    buttons: {
      enabled: false
    }
  }
}
```

## How do I configure my OpenMRS implementation?

There are two methods for doing so.

### The Simple Way

Upload your configuration file and add its URL to
your import map as a module named **config-file**. If you are serving your
microfrontends from your OpenMRS server, you can simply add your config
file to your server's `frontend/` directory. Your import map will then look like

```json
{
  "imports": {
    "config-file": "/openmrs/frontend/config.js[on]"
  }
}
```

### The Flexible Way

You can also provide config files programmatically. This technique 
allows you to have multiple configuration files, which will be
merged together in an order that you specify.

To do this you need to create a (simple) custom module, which you will add to your
import map. Its name in the import map should be suffixed with `-app`.
This will ensure it is loaded.

You add your configuration
files to this module, import them, and `provide` them to
esm-config.

Example code:

```js
import { provide } from "@openmrs/esm-config";

import myOrgConfig from "./org-config.json";
import myOrgLocalConfig from "./org-local-config.json";

provide(myOrgConfig);
provide(myOrgLocalConfig);
```

All provided configs will be merged, with elements provided by later calls
to provide taking priority. The import map config file, `config-file`, will
also be merged, and will take the highest priority. In the above example,
configuration elements in `org-local-config.json` will take priority over
those in `org-config.json`.

You can break up your configuration files into hierarchies, or per module, or per groups of modules.

## I'm developing an ESM module. How do I make it configurable?

You should use this module, esm-config, to make your modules configurable.

Start with `npm install --save-dev @openmrs/esm-config`. This is a runtime
dependency, so you should also include it in `peerDependencies`.

The main task is to create a config schema for your module. The config schema
is what tells `esm-config` what configuration files should look like,
including defaults and validations.

### Designing a schema

You'll probably start with some idea of what you want configs for your module
to look like. Try and put yourself in the implementer's shoes an imagine what
features they will expect to be configurable, and what they might expect the
configuration property to be called. Assume they don't know anything about
the internal workings of your module.

By way of example, let's say we're building a module for a virtual provider
functionality at a very futuristic hospital. Maybe we want an implementer to
be able to write the following in their config file:

```json
"@openmrs/esm-hologram-doctor": {
  "hologram": {
    "color": true
  },
  "virtualProvider": {
    "name": {
      "given": ["Qui", "Gon"]
    }
  },
  "robots": [
    { "name": "R2-D2", "homeworld": "Naboo" },
    { "name": "BB-8", "homeworld": "Hosnian Prime" }
  ]
}
```

In the following section, we'll see how to write a config schema that supports these config elements.

### Defining a schema

We'll start with just that first nested config element from above, `hologram.color`.
We must provide defaults for all of the values—in OpenMRS Frontend 3.0, all
configuration is optional. All modules should do something reasonable out of the box.

```js
import { defineConfigSchema, Type } from "@openmrs/esm-config"

defineConfigSchema("@openmrs/esm-hologram-doctor", {
  hologram: {
    color: {
      _type: Type.Boolean,
      _default: false,
      _description: "Whether the cologram supports color display."
    }
  }
}
```

Note that each configuration element should have an object for a value, and
that this object must define the properties for that element. Do not do this:

```js
❌ // This is wrong!
❌ defineConfigSchema("@openmrs/esm-hologram-doctor",
❌  hologram: {
❌   salutation: "Some friendly default salutation! ? this is wrong!"
❌ })
```

The words prefixed with `_` are schema keywords. Do not prefix the names of your
config elements with underscores. Especially do not use a schema keyword as
a config element name.

```js
❌ // Don't do this!
❌ defineConfigSchema("@openmrs/esm-hologram-doctor",
❌  hologram: {
❌    salutation: {
❌      _default: {
❌        _default: "Greetings ? this is bad don't do it"
❌ }}})
```

#### Typing

While not strictly required in the current version, you should provide a type
for every config element you define. The `_type` keyword accepts values from
the Type enum.

These types are used both to validate input and to support special behavior
in the implementer tools.

#### Validators

You should provide validators for your configuration elements wherever possible.
This reduces the probability that implementers using your module will have
hard-to-debug runtime errors. It gives you, the module developer, the opportunity
to provide implementers with very helpful explanations about why their configuration
on't work.

```js
robot: {
  name: {
    _type: Type.String,
    _default: "R2D2",
    _description: "What to call the robot",
    _validators: [
      validator(n => /\d/.test(n), "Robots must have numbers in their names")
    ]
  }
}
```

(Note that this piece of schema is not part of our above example. It only supports
a single robot, whereas we need to allow the implementer to provide an array of robots).

A validator can be created using the `validator` function, as above.

The first argument is a function that takes the config value as its only argument.
If the function returns something
[truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), validation passes.
If the function
returns something [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy),
an error is thrown with the second argument as an explanation.

You can even validate nested objects:

```js
colorPicker: {
  options: { _default: ["green", "red", "blue"] }
  initial: { _default: "green" },
  _description: "The color picker for lightsabers",
  _validators: [
    validator(o => o.options.includes(o.initial),
      "Initial must be one of the options")
  ]
}
```

For convenience, some common validators are provided out of the box. See the
[API / validators](#const-validators).

#### Arrays

You can accept and validate arrays, and arrays containing objects, in your
configuration schema. This is configured with the `elements` parameter, used
with `_type: Type.Array`. For example, a schema which would accept an array
of strings up to 30 characters long:

```js
virtualProvider: {
  name: {
    given: {
      _type: Type.Array,
      _default: ["Obi", "Wan"]
      _elements: {
        _type: Type.String
        _validators: [validator(n => n.length < 30, "Must be less than 30 characters")]
      }
    },
    _description: "The name of the avatar. Does not have to be the name of the actual provider"
  },
  _description: "The avatar of the medical practitioner"
}
```

Here is an example of a schema that expects an array of objects structured in a particular way.

```js
robots: {
  _type: Type.Array,
  _default: [
    { name: "R2-D2", homeworld: "Naboo" },
    { name: "C-3PO", homeworld: "Tatooine" }
  ],
  _description: "The list of all available robots",
  _elements: {
    name: {
      _type: Type.String,
      _description: "What to call the robot",
      _validators: [robotNameValidator]
    },
    homeworld: {
      _type: Type.String,
      _description: "Where the robot is from",
      _default: null  // not required
    }
  }
}
```

This schema will require that any objects in the robots array must only have
the keys `name` and `homeworld`, and that `name` is required.

Objects within arrays do not
have to have defaults. If an object is supplied to the `robots` array that
does not have a `name`, an error will be thrown.

#### Freeform objects

In unusual scenarios you might want to accept an object without
validating its keys. To do this, you can specify the config element 
like a normal non-object element.

```js
beepsPerRobot: {
  _type: Type.Object
  _default: {
    "R2-D2": 4,
    "C-3P0": 0
  },
  _elements: {  // describes the *values* of the object
    _type: Type.Number
    _validators: [validator(n => Number.isInteger(n), "Beeps must be integers")]
  },
  _description: "An object mapping robot names to number of beeps",
  _validators: [
    validator(o => Object.keys(o).every(n => /\d/.test(n)),
      "Robots must have numbers in their names")
  ]
}
```

Note that this is the only situation in which you should ever use `Type.Object`.

### Using config values

#### The generic way

The config is fetched asynchronously using `getConfig(moduleName)`. Continuing the
above example, we would have something like

```js
import { getConfig } from "@openmrs/esm-config"

async function doctorGreeting() {
  const config = await getConfig("@openmrs/esm-hologram-doctor")
  return "Hello, my name is Dr. " + config.virtualProvider.name.family
}
```

The content of config will be pulled from the config files, falling back to
the defaults for configuration elements for which no values have been provided.

#### React support

A React Hook is provided to hide the asynchronicity of config loading. The
`moduleName`provided to the
[openmrs react root decorator](https://github.com/openmrs/openmrs-react-root-decorator)
is used to look up the configuration elsewhere in the application.

```js
export default openmrsRootDecorator({
  featureName: "hologram doctor",
  moduleName: "@openmrs/esm-hologram-doctor"
})(Root)
```

You can then get the config tree as an object using the `useConfig` React hook.

```js
import { useConfig } from "@openmrs/esm-config"

export default function DoctorGreeting() {
  const config = useConfig()
  const greeting = "Hello, my name is Dr. " + config.virtualProvider.name.family
  return <div>{greeting}</div>
}
```

The content of config will be pulled from the config files, falling back to the
defaults for configuration elements for which no values have been provided.

#### Support in other frameworks (Angular, Vue, Svelte, etc.)

This hasn't been implemented yet, but we would like to implement it! See "Contributing"

## Schema Reference

#### `_default`

All config elements must have a default (excluding elements within arrays of objects).

The default does not necessarily need to satisfy the `_type` or the `_validators` of
the element, but this may change in future versions.

#### `_type`

One of the values from the `Type` enum. Used for validation and to help the
implementer tools work with the element.

Should always appear alongside `_default`.

#### `_description`

Helps implementers understand what the configuration element actually does and
how it is intended to be used.

Can be used anywhere within the schema structure.

#### `_validators`

An array of validator objects.

Some common validators are
provided: [API / validators](#const-validators).

Custom validators should
be created with the [validator](#validator) function.

Can be used anywhere within the schema structure.

#### `_elements`

Only valid alongside `_type: Type.Array` or `_type: Type.Object`. A `_default`
must also be provided at this level. Value should be an object which is
a schema for the values contained in the array or object.

## API

<!-- API -->

### Variables

* [ModuleNameContext](README.md#const-modulenamecontext)

### Navigation Functions

* [ConfigurableLink](README.md#configurablelink)
* [interpolateString](README.md#interpolatestring)
* [navigate](README.md#navigate)

### Other Functions

* [defineConfigSchema](README.md#defineconfigschema)
* [getConfig](README.md#getconfig)
* [processConfig](README.md#processconfig)
* [provide](README.md#provide)
* [useConfig](README.md#useconfig)
* [validator](README.md#validator)

### Object literals

* [validators](README.md#const-validators)

## Variables

### `Const` ModuleNameContext

• **ModuleNameContext**: *Context‹null | string›* = React.createContext<string | null>(null)

*Defined in [react-hook/react-hook.tsx:4](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/react-hook/react-hook.tsx#L4)*

## Navigation Functions

###  ConfigurableLink

▸ **ConfigurableLink**(`__namedParameters`: object): *Element‹›*

*Defined in [navigation/react-configurable-link.tsx:13](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/react-configurable-link.tsx#L13)*

A React link component which calls [navigate](README.md#navigate) when clicked

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`children` | any | Inline elements within the link |
`otherProps` | otherProps | Any other valid props for an <a> tag except `href` and `onClick` |
`to` | string | The target path or URL. Supports interpolation. See [navigate](README.md#navigate) |

**Returns:** *Element‹›*

___

###  interpolateString

▸ **interpolateString**(`template`: string, `params`: object): *string*

*Defined in [navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/interpolate-string.ts#L38)*

Interpolates values of `params` into the `template` string.

Useful for additional template parameters in URLs.

Example usage:
```js
navigate({
 to: interpolateString(
   config.links.patientChart,
   { patientUuid: patient.uuid }
 )
});
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`template` | string | With optional params wrapped in `${ }` |
`params` | object | Values to interpolate into the string template |

**Returns:** *string*

___

###  navigate

▸ **navigate**(`__namedParameters`: object): *void*

*Defined in [navigation/navigate.ts:24](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/navigate.ts#L24)*

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`to` | string | The target path or URL. Supports templating with 'openmrsBase' and 'openmrsSpaBase'. For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home` for implementations using the standard OpenMRS and SPA base paths. |

**Returns:** *void*

___

## Other Functions

###  defineConfigSchema

▸ **defineConfigSchema**(`moduleName`: string, `schema`: ConfigSchema): *void*

*Defined in [module-config/module-config.ts:20](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |
`schema` | ConfigSchema |

**Returns:** *void*

___

###  getConfig

▸ **getConfig**(`moduleName`: string): *Promise‹ConfigObject›*

*Defined in [module-config/module-config.ts:29](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |

**Returns:** *Promise‹ConfigObject›*

___

###  processConfig

▸ **processConfig**(`schema`: ConfigSchema, `providedConfig`: ConfigObject, `keyPathContext`: string): *Config*

*Defined in [module-config/module-config.ts:42](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L42)*

Validate and interpolate defaults for `providedConfig` according to `schema`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schema` | ConfigSchema | a configuration schema |
`providedConfig` | ConfigObject | an object of config values (without the top-level module name) |
`keyPathContext` | string | a dot-deparated string which helps the user figure out where     the provided config came from  |

**Returns:** *Config*

___

###  provide

▸ **provide**(`config`: Config, `sourceName`: string): *void*

*Defined in [module-config/module-config.ts:25](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L25)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | Config | - |
`sourceName` | string | "provided" |

**Returns:** *void*

___

###  useConfig

▸ **useConfig**(): *any*

*Defined in [react-hook/react-hook.tsx:8](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/react-hook/react-hook.tsx#L8)*

**Returns:** *any*

___

###  validator

▸ **validator**(`validationFunction`: ValidatorFunction, `message`: string): *Validator*

*Defined in [validators/validator.ts:1](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validator.ts#L1)*

**Parameters:**

Name | Type |
------ | ------ |
`validationFunction` | ValidatorFunction |
`message` | string |

**Returns:** *Validator*

## Object literals

### `Const` validators

### ▪ **validators**: *object*

*Defined in [validators/validators.ts:66](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L66)*

###  isBoolean

• **isBoolean**: *function*

*Defined in [validators/validators.ts:69](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L69)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isNumber

• **isNumber**: *function*

*Defined in [validators/validators.ts:68](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L68)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isObject

• **isObject**: *function*

*Defined in [validators/validators.ts:71](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L71)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isString

• **isString**: *function*

*Defined in [validators/validators.ts:67](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L67)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isUrl

• **isUrl**: *function*

*Defined in [validators/validators.ts:72](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L72)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isUrlWithTemplateParameters

• **isUrlWithTemplateParameters**: *isUrlWithTemplateParameters*

*Defined in [validators/validators.ts:73](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L73)*

###  isUuid

• **isUuid**: *function*

*Defined in [validators/validators.ts:70](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L70)*

#### Type declaration:

▸ (`value`: any): *void | string*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
<!-- ENDAPI -->

## Contributing & Development

PRs welcome! See
[OpenMRS Microfrontends RFC-20](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0020-contributing-guidelines.md#contributing-guidelines)
for guidelines about contributing.

[Setup local development environment for OpenMRS SPA](https://wiki.openmrs.org/display/projects/Setup+local+development+environment+for+OpenMRS+SPA).

Maintainer: Brandon Istenes (bistenes@pih.org)
