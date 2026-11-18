// A remote whose tsconfig has no `include`, so TypeScript takes in the whole app directory.
// `type-checker-watchers.test.ts` checks what the type checker ends up watching for it.
export function startupApp() {
  return 'started';
}
