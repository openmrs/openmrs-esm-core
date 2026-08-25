// The smallest thing that still produces a Module Federation remote entry: the app shell only requires
// that a remote expose `./start`.
export function startupApp() {
  return 'started';
}
