# Sharing State between Frontend Modules

In general, state in React apps should be
[managed using React](https://kentcdodds.com/blog/application-state-management-with-react).
Use the [State Hook](https://reactjs.org/docs/hooks-state.html) (or
[Reducer Hook](https://reactjs.org/docs/hooks-reference.html#usereducer))
and [Context](https://reactjs.org/docs/context.html) to pass state around within your
frontend module.

In some cases, you may need to manage state outside React, such as when you
have separate React applications that need to share state.
This can come up, for example, if you your frontend module has multiple extensions
that need to share state with each other.

In these cases you can use the
[`@openmrs/esm-state`](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/framework/esm-state)
features of `@openmrs/esm-framework`. The framework provides functions for
managing state using [Unistore](https://github.com/developit/unistore#unistore).

## How do I use it?

A Unistore store can be created using
[`createGlobalStore`](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#createglobalstore):

```typescript
import { createGlobalStore } from '@openmrs/esm-framework';

export interface BooksStore {
  books: Array<string>;
}

createGlobalStore("books", {
  books: [],
});
```

The store can then be accessed using
[`getGlobalStore`](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#getglobalstore)

```typescript
import { getGlobalStore } from '@openmrs/esm-framework';

const bookStore = getGlobalStore("books");
console.log(bookStore.getState());
bookStore.subscribe(books => console.log(books));
bookStore.setState({ books: ["Pathologies of Power"]});
```

### In React:

```typescript
import React, { useEffect } from 'react';
import { getGlobalStore, useStore } from '@openmrs/esm-framework';

const bookStore = getGlobalStore("books");

function BookShelf() {
  const { books } = useStore(bookStore);
  return <>{books.join(",")}</>;
}
```

There are a few other ways that you can use stores in React, such as by creating
a subscription in a `useEffect` block, or by using `Provider` and `connect`, but
this method is by far the simplest.

### Other notes

If your directory structure allows, you can also pass stores around explicitly:

```typescript
// bookStore.ts
export bookStore = createGlobalStore("books", {
  books: [],
});
```

```typescript
import { bookStore } from "./bookStore";
bookStore.setState({ books: ["A History of Global Health"] });
```

See the [Unistore docs](https://github.com/developit/unistore#unistore) for more
information about stores.

