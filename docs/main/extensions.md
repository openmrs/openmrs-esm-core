# Using the Extension System

The extension system makes it possible for frontend modules to
insert UI elements into each other, and for these interactions
to be configurable by system administrators.

> Those familiar with the
[OpenMRS RefApp 2.x extension system](https://wiki.openmrs.org/display/docs/Module+Extension+Points)
will be glad to know that the basic concepts here are similar, but simpler.
"Extensions" are roughly the same thing as before, "points" are now
called "slots," and there is no longer anything like "apps," which no one
really understood anyway.

## Key Concepts

There are two kinds of things in the extension system: **extensions** and **slots**.

An **extension** is a component.

A **slot** is a place.

Read the above two lines until they resonate in your head like a mantra.

Extensions get rendered into slots. An extension gets associated with a
slot in one of the following ways:
- The extension names the slot in its definition, under `slot[s]`
- A call to [attach](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#attach)
- A system administrator adds the extension to the slot using the
  slot's `add` array

## When should I use extensions and slots?

The extension system should be thought of as a system for making
behavior configurable by administrators. It should not be thought of
way to reuse components across modules.

This is the key question:

_Am I creating a collection of similar things, such as buttons or
tiles, which an administrator might want to re-order or otherwise
change?_

If so, this may be a good place to use extensions.

### What if I just want to mount something from one framework into something in another framework?

Just use the Single-SPA
[mountParcel](https://single-spa.js.org/docs/parcels-overview/#mountrootparcel-vs-mountparcel)
function.

### What if I just want to use a component from one module in a different module, and I can change both?

Consider exporting the component and using it the normal way.

## Usage

Extensions are defined in the `routes.json` file bundled with a module, in an
`extensions` array. Each element of this array defines an extension, with
a name and a load function. It may also specify the names of slots to
attach the extension to by default. It may also specify
[a number of other things](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/interfaces/ExtensionRegistration.md),
some of which will be covered below.

Slots are components. There is an [ExtensionSlot](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#extensionslot)
React component. If you are working in a different framework and would like to create
an extension slot, please get in touch with the OpenMRS Frontend 3.0 team
on Slack.

## Principles

### Naming extensions

An extension will have a name which identifies it. That name should describe
what the extension does. It should not have anything to do with where the
extension will appear in the application. It has no innate sense of place.

:heavy_check_mark: Good extension names:
- Vitals table
- User avatar
- Biometrics tile

:x: Bad extension names:
- _Top_ bar ("top" indicates a place)
- _Home page_ reports link ("home page" indicates a place)
- Steve (names should be descriptive)

> **Note**: You will likely see a lot of extension and slot names which
> are all lowercase with dashes. This is not necessary; it is better
> to give extensions names that are pleasant to read.
>
> Similarly, you will see many slots suffixed with "slot." This is also
> not necessary.

### Naming slots

A slot will also have a name which identifies it. That name should describe
the location in the app that it represents. If it describes the things that
can go in it, it should only use the most general terms imaginable—things
like "button" or "tile" or "widget."

:heavy_check_mark: Good slot names:
- Primary nav right menu
- Patient header detail box
- Form header buttons

:x: Bad slot names:
- Patient address (too prescriptive about contents)
- homepage-widgets-slot (should be `Homepage widgets`)
- Extra buttons (too vague)

### Styling

An extension should be as agnostic as possible to the context in which it
appears. This means that you should avoid defining the size of an extension.
Extensions should be responsive (within reason), such that the contents
will adapt to a variety of different extension dimensions.

Slots should be responsible for as much styling as generically applies to
all of their contents. If all of the extensions in a slot should have a
border, the slot should apply the border. The slot should also be responsible
for setting the dimensions into which the extensions will render.

A slot can apply styles to an extension with the following CSS selector:

```css
.slot > * > * {
  ...
}
```

## Extension configurability

The beautiful thing about configurability in the extension system is
that you don't need to think about it. Extensions and
slots have a standard configuration interface that allows administrators
to add, remove, and re-order extensions, as well as specific
configuration specific to an extension within a particular slot.

You can use `useConfig` as usual within an extension.

The schema for an extension can be specified using `defineExtensionConfigSchema`.
If no schema is defined specifically for your extension, the extension will inherit
the configuration of the module that contains it.

## State

Sometimes, extensions are not as independent as we might wish they were,
and have to expect some state from the slot in which they are mounted.
Most commonly, extensions that pertain to a specific patient will accept
a `patientUuid` parameter which can be used to fetch relevant patient
information.

State is provided as a parameter to the `ExtensionSlot` or `Extension`
components, and recieved as a prop by the extension.

See the [ExtensionSlot API docs](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#extensionslot)
for more.

## Meta

Sometimes, extensions might want to pass information to the slot that
receives them. This is used, for example, by patient chart widgets.
Dashboards render these widgets into a grid format. When a dashboard
receives a widget, the widget informs the dashboard (which is a slot)
how many grid columns it would like to take up. This happens using `meta`.

Meta is provided by extensions in their definition in the `routes.json`
file.

Slots can access meta through the extension system API, such as by using
[useExtensionSlotMeta](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#useextensionslotmeta).

## Offline Support

For information about offline support, please see [Offline Mode](../offline/offline.md).

## Order

By default, extensions will render into slots in the order that they are
declared or attached. Extensions which are added by an administrator come
last.

Extensions can provide an `order` index in their definition to influence
the order in which they are rendered. This works like
[z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
in CSS—similarly, it is a way of setting relative order among elements
that don't officially know about each other.

Administrators can also override the order of extensions within any slot
by modifying the `order` configuration parameter of that slot.

## Additional Resources

Short introductory videos:
- [OpenMRS Frontend 3 Extension System 1 - Basics](https://youtu.be/Teq3FwKofSc)
- [OpenMRS Frontend 3 Extension System 2 - State and Meta](https://youtu.be/8514ebpAEWI)

Introductory presentation: [Quick Guide to Slots](https://docs.google.com/presentation/d/1mQxh7qAYLD-gc9sh0I58t4o_XNndPcu6hAJmTZQZ_fo/edit#slide=id.gbe34f6b087_0_34 )

For a terse technical description of the extension system, see the
[Extensions RFC](https://github.com/openmrs/openmrs-rfc-frontend/pull/27/files).

### Workshop

A live workshop was hosted on Zoom, providing a comprehensive introduction 
to the extension system, as well as practical problems.
Recordings and materials are available below.

- [Part 1: About our Frontend Module Architecture & How to Use Extensions](https://iu.mediaspace.kaltura.com/media/t/1_e7kvnx9t?st=702)
- [Part 2: Practical Session on our MFE Architecture & How to Use Extensions](https://iu.mediaspace.kaltura.com/media/t/1_iaq63mfd?st=282)
  - [Practice tasks](https://github.com/openmrs/openmrs-esm-testresults/tree/feature/workshop)
  - [Practice solutions](https://github.com/openmrs/openmrs-esm-testresults/tree/feature/workshop-solutions)
