# openmrs-esm-state

An [OpenMRS Microfrontend](https://wiki.openmrs.org/display/projects/Frontend+-+SPA+and+Microfrontends).

[API Docs](docs/API.md)

## Contents

<!-- toc -->

- [What is this?](#what-is-this)
- [How do I use it?](#how-do-i-use-it)
- [Contributing / Development](#contributing--development)
- [API](#api)
- [createGlobalStore](#createglobalstore)
- [getGlobalStore](#getglobalstore)
- [getAppState](#getappstate)

<!-- tocstop -->

## What is this?

openmrs-esm-state is an [in-browser javascript module](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0002-modules.md)
that provides functions for managing OpenMRS state using [Unistore](https://github.com/developit/unistore#unistore).

It also provides a global Unistore store called `app`.

## How do I use it?

```typescript
import { createGlobalStore } from '@openmrs/esm-state';

export interface BooksStore {
  books: Array<string>;
}

createGlobalStore("books", {
  books: [],
});
```

```typescript
import { getGlobalStore } from '@openmrs/esm-state';

const booksStore = getGlobalStore("books");
console.log(booksStore.getState());
booksStore.subscribe(books => console.log(books));
booksStore.setState({ books: ["Pathologies of Power"]});
```

```typescript
import { getAppState } from '@openmrs/esm-state';

console.log(getAppState().getState());
```

In React:

```typescript
import React, { useEffect } from 'react';
import { getGlobalStore } from '@openmrs/esm-state';

function BookShelf() {
  useEffect(() => {
    function update(state) {
      console.log(state);
    }
    const store = getGlobalStore("books");
    // Use `getState` to run `update` on the current state.
    update(store.getState());
    // Use `subscribe` to run `update` on all future state updates.
    // It returns an `unsubscribe` function. Return that function
    // in `useEffect` so that it runs when the component unmounts.
    return store.subscribe(update);
  }, [])
}
```

Also see [connect](https://github.com/developit/unistore#connect) and
[Provider](https://github.com/developit/unistore#provider).

See [the Unistore docs](https://github.com/developit/unistore#unistore) for more
information about stores.

## Contributing / Development

[Instructions for local development](https://wiki.openmrs.org/display/projects/Setup+local+development+environment+for+OpenMRS+SPA)

## API

The following functions are exported from the `@openmrs/esm-state` module:

## createGlobalStore

```typescript
createGlobalStore<TState>(name: string, initialState: TState): Store<TState>
```

Creates a [store](https://github.com/developit/unistore#store).

##### Arguments

1. `name` (required): A name by which the store can be looked up later. Must be unique across the entire application.
2. `initialState` (required): An object which will be the initial state of the store.

##### Return value

The newly created store.

## getGlobalStore

```typescript
getGlobalStore<TState = any>(name: string, fallbackState?: TState): Store<TState>
```

Returns the existing [store](https://github.com/developit/unistore#store) named `name`,
or creates a new store named `name` if none exists.

##### Arguments

1. `name` (required): The name of the store to look up.
2. `fallbackState` (optional): The initial value of the new store if no store named `name` exists.

##### Return value

The found or newly created store.

## getAppState

Returns the [store](https://github.com/developit/unistore#store) named `app`.
