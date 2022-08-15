# Using the Configuration System

A framework is provided to make configurability easier for developers and
configuring easier for implementers.

For introduction to Frontend 3.0 config files and how to configure frontend modules,
please see the the
[Implementer Documentation](https://wiki.openmrs.org/pages/viewpage.action?pageId=224527013#O3ImplementerDocumentation:SetUp,Configure&Deploy-Part2:ConfigureYourO3Application).

## How to make a frontend module configurable

You should use the OpenMRS Frontend Framework to make modules configurable.

The main task is to create a config schema for your module. The config schema
is what tells the framework what configuration files should look like,
including defaults and validations.

### Designing a schema

You'll probably start with some idea of what you want configs for your module
to look like. Try and put yourself in the implementer's shoes and imagine what
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
import { defineConfigSchema, Type } from "@openmrs/esm-framework"

defineConfigSchema("@openmrs/esm-hologram-doctor", {
  hologram: {
    color: {
      _type: Type.Boolean,
      _default: false,
      _description: "Whether the hologram supports color display."
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
doesn't work.

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
[API / validators](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#validators).

#### Arrays

You can accept and validate arrays, and arrays containing objects, in your
configuration schema. This is configured with the `elements` parameter, used
with `_type: Type.Array`. For example, a schema which would accept an array
of strings up to 30 characters long would look like this:

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

### Using config values

#### The generic way

The config is fetched asynchronously using `getConfig(moduleName)`. Continuing the
above example, we would have something like

```js
import { getConfig } from "@openmrs/esm-framework"

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
[`openmrsComponentDecorator` in esm-react-utils](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/framework/esm-react-utils)
is used to look up the configuration elsewhere in the application.

```js
export default openmrsRootDecorator({
  featureName: "hologram doctor",
  moduleName: "@openmrs/esm-hologram-doctor"
})(Root)
```

You can then get the config tree as an object using the `useConfig` React hook.

```js
import { useConfig } from "@openmrs/esm-framework"

export default function DoctorGreeting() {
  const config = useConfig()
  const greeting = "Hello, my name is Dr. " + config.virtualProvider.name.family
  return <div>{greeting}</div>
}
```

The content of config will be pulled from the config files, falling back to the
defaults for configuration elements for which no values have been provided.

#### Support in other frameworks (Angular, Vue, Svelte, etc.)

This hasn't been implemented yet, but we would like to implement it! See [Contributing](../getting_started/contributing.md).


### Typing

It is nice to be able to have type validation for your use of configuration. To
accomplish this, define an interface alongside your config schema.

```ts
import { defineConfigSchema, Type } from "@openmrs/esm-framework"

defineConfigSchema("@openmrs/esm-hologram-doctor", {
  hologram: {
    color: {
      _type: Type.Boolean,
      _default: false,
      _description: "Whether the hologram supports color display."
    }
  }
});

export interface HologramDoctorConfig {
  hologram: {
    color: boolean;
  }
}
```

You can then use this typing information using the `as` keyword.

```ts
const config = useConfig() as HologramDoctorConfig;
```

## Schema Reference

#### `_default`

All config elements must have a default (excluding elements within arrays of objects).

The default does not necessarily need to satisfy the `_type` or the `_validators` of
the element, but this may change in future versions.

#### `_type`

One of the values from [the `Type` enum](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/enums/Type.md). Used for validation and to help the
implementer tools work with the element.

Should always appear alongside `_default`.

#### `_description`

Helps implementers understand what the configuration element actually does and
how it is intended to be used.

Can be used anywhere within the schema structure.

#### `_validators`

An array of validator objects.

Some common validators are
provided: [API / validators](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#config-validation-functions).

Custom validators should
be created with the [validator](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#validator) function.

Can be used anywhere within the schema structure.

#### `_elements`

Only valid alongside `_type: Type.Array`. A `_default`
must also be provided at this level. Value should be a schema for the values
contained in the array.

## API Documentation

See the Config Functions section of the [API docs](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md).

## The RFC

This package was established as the result of
[RFC #14](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0014-configuration.md).
This document provides the rationale and guiding principles of the configuration
system.
