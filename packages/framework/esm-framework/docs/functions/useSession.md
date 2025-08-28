[O3 Framework](../API.md) / useSession

# Function: useSession()

> **useSession**(): `Session`

Defined in: [packages/framework/esm-react-utils/src/useSession.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useSession.ts#L17)

Gets the current user session information. Returns an object with
property `authenticated` == `false` if the user is not logged in.

Uses Suspense. This hook will always either return a Session object
or throw for Suspense. It will never return `null`/`undefined`.

## Returns

`Session`

Current user session information
