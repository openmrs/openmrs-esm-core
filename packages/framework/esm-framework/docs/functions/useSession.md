[O3 Framework](../API.md) / useSession

# Function: useSession()

> **useSession**(): [`Session`](../interfaces/Session.md)

Defined in: [packages/framework/esm-react-utils/src/useSession.ts:17](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useSession.ts#L17)

Gets the current user session information. Returns an object with
property `authenticated` == `false` if the user is not logged in.

Uses Suspense. This hook will always either return a Session object
or throw for Suspense. It will never return `null`/`undefined`.

## Returns

[`Session`](../interfaces/Session.md)

Current user session information
