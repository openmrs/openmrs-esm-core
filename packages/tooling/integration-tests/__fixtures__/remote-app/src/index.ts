// Body is written to produce a minimal ./start chunk and to be
// rewritten if things are newer than ES5
class Startup {
  #state = 'started';

  get state() {
    return this.#state;
  }
}

export async function startupApp(options?: { state?: string }) {
  return options?.state ?? new Startup().state;
}
