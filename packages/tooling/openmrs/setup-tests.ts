import { afterEach, beforeEach } from 'vitest';

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = { ...process.env };
});

afterEach(() => {
  // Mutate rather than replace process.env so we preserve Node's built-in
  // proxy behavior (which coerces assigned values to strings). Replacing
  // the object wholesale with `process.env = savedEnv` would lose this.
  for (const key of Object.keys(process.env)) {
    if (!(key in savedEnv)) {
      delete process.env[key];
    }
  }
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});
