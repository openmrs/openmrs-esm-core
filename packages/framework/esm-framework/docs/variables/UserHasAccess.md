[O3 Framework](../API.md) / UserHasAccess

# Variable: UserHasAccess

> `const` **UserHasAccess**: `React.FC`\<[`UserHasAccessProps`](../interfaces/UserHasAccessProps.md)\>

Defined in: [packages/framework/esm-react-utils/src/UserHasAccess.tsx:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/UserHasAccess.tsx#L40)

A React component that renders its children only if the current user exists and has the privilege(s)
specified by the `privilege` prop. This can be used not to render certain components when the user
doesn't have the permission to use this.

Note that for top-level extensions (i.e., the component that's the root of the extension), you don't
need to use this component. Instead, when registering the extension, declare the required privileges
as part of the extension registration. This is for use deeper in extensions or other components where
a separate permission check might be needed.

This can also be used to hide components when the current user is not logged in.

## Example

```ts
<Form>
  <UserHasAccess privilege='Form Finallizer'>
    <Checkbox id="finalize-form" value={formFinalized} onChange={handleChange} />
  </UserHasAccess>
</Form>
````

@param props.privilege Either a string for a single required privilege or an array of strings for a
  set of required privileges. Note that sets of required privileges must all be matched.
@param props.fallback What to render if the user does not have access or if the user is not currently
  logged in. If not provided, nothing will be rendered
@param props.children The children to be rendered only if the user is logged in and has the required
  privileges.
