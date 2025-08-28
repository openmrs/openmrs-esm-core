[O3 Framework](../API.md) / showModal

# Function: showModal()

> **showModal**(`modalName`, `props`, `onClose`): () => `void`

Defined in: [packages/framework/esm-styleguide/src/modals/index.tsx:200](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/modals/index.tsx#L200)

Shows a modal dialog.

The modal must have been registered by name. This should be done in the `routes.json` file of the
app that defines the modal. Note that both the `<ModalHeader>` and `<ModalBody>` should be at the
top level of the modal component (wrapped in a React.Fragment), or else the content of the modal
body might not vertical-scroll properly.

## Parameters

### modalName

`string`

The name of the modal to show.

### props

`ModalProps` = `{}`

The optional props to provide to the modal.

### onClose

() => `void`

The optional callback to call when the modal is closed.

## Returns

The dispose function to force closing the modal dialog.

> (): `void`

### Returns

`void`
