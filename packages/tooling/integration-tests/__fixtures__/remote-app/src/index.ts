// The smallest thing that still produces a Module Federation remote entry: the app shell only requires
// that a remote expose `./start`.
//
// The private field, `async` and optional chaining are deliberate. Each is syntax a target older than
// the browsers O3 supports has to rewrite, which is what lets `browser-targets.test.ts` tell a build
// compiled for those browsers from one down-levelled to ES5. Don't simplify them away.
class Startup {
  #state = 'started';

  get state() {
    return this.#state;
  }
}

export async function startupApp(options?: { state?: string }) {
  return options?.state ?? new Startup().state;
}
