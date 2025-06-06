[@openmrs/esm-framework](../API.md) / SetLeftNavParams

# Interface: SetLeftNavParams

## Table of contents

### Properties

- [basePath](SetLeftNavParams.md#basepath)
- [componentContext](SetLeftNavParams.md#componentcontext)
- [mode](SetLeftNavParams.md#mode)
- [name](SetLeftNavParams.md#name)

## Properties

### basePath

• **basePath**: `string`

#### Defined in

[packages/framework/esm-extensions/src/left-nav.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/left-nav.ts#L22)

___

### componentContext

• `Optional` **componentContext**: [`ComponentConfig`](ComponentConfig.md)

#### Defined in

[packages/framework/esm-extensions/src/left-nav.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/left-nav.ts#L29)

___

### mode

• `Optional` **mode**: `LeftNavMode`

In normal mode, the left nav is shown in desktop mode, and collapse into hamburger menu button in tablet mode
In collapsed mode, the left nav is always collapsed, regardless of desktop / tablet mode.
In hidden mode, the left nav is not shown at all.

#### Defined in

[packages/framework/esm-extensions/src/left-nav.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/left-nav.ts#L28)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/left-nav.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/left-nav.ts#L21)
