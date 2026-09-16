# openmrs-esm-expression-evaluator

openmrs-esm-expression-evaluator provides functions to allow evaluating user-defined expressions in a way safer than eval.

## Writing null-safe expressions

Member access on `null` or `undefined` is an error, as it is in JavaScript, so an expression that runs
against data which may not have loaded yet needs a guard. `&&`, `||` and `??` short-circuit, and optional
chaining is supported, so any of these work:

```js
session?.user ? session.user.privileges.some((p) => p.display === 'Some Privilege') : false;
session && session.user && session.user.privileges.length > 0;
```

A short circuit abandons the rest of the chain rather than a single access, so `a?.b.c.d` is `undefined`
when `a` is nullish. A property that is genuinely missing is still an error: `a?.b.c` throws when `a` is
`{}`, because `a.b` is undefined for reasons optional chaining says nothing about.

## What the sandbox guarantees

Expressions are interpreted from a jsep AST; they are never compiled or run by the JS engine. The
interpreter supports only the expression language, so there is no assignment, no statements, no object
literals, and no `this`. Inline arrow functions *are* supported, since callbacks like
`arr.find((v) => v === needle)` are a large part of what expressions are for; what is prohibited is
building a function from a string, which is what an escape to the `Function` constructor would give you.
An expression sees nothing but the `variables` it is handed and the small set of globals in `globals.ts`.
