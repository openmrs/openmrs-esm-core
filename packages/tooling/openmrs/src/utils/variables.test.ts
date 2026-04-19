import { describe, expect, it } from 'vitest';
import { setEnvVariables } from './variables';

describe('setEnvVariables', () => {
  it('sets a single environment variable', () => {
    setEnvVariables({ TEST_VAR: 'value' });
    expect(process.env.TEST_VAR).toBe('value');
  });

  it('sets multiple environment variables', () => {
    setEnvVariables({ VAR_A: 'a', VAR_B: 'b', VAR_C: 'c' });
    expect(process.env.VAR_A).toBe('a');
    expect(process.env.VAR_B).toBe('b');
    expect(process.env.VAR_C).toBe('c');
  });

  it('overwrites existing environment variables', () => {
    process.env.EXISTING = 'old';
    setEnvVariables({ EXISTING: 'new' });
    expect(process.env.EXISTING).toBe('new');
  });

  it('does not remove previously-set variables not in the input', () => {
    process.env.KEEP_ME = 'keep';
    setEnvVariables({ OTHER: 'other' });
    expect(process.env.KEEP_ME).toBe('keep');
  });
});
