import { describe, expect, it, vi } from 'vitest';
import chalk from 'chalk';
import { logInfo, logWarn, logFail } from './logger';

// Disable chalk coloring so assertions can match exact strings
chalk.level = 0;

describe('logInfo', () => {
  it('calls console.log with the [openmrs] prefix and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logInfo('test message');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0]![0]).toContain('[openmrs]');
    expect(spy.mock.calls[0]![0]).toContain('test message');
  });
});

describe('logWarn', () => {
  it('calls console.warn with the [openmrs] prefix and message', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logWarn('warning message');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0]![0]).toContain('[openmrs]');
    expect(spy.mock.calls[0]![0]).toContain('warning message');
  });
});

describe('logFail', () => {
  it('calls console.error with the [openmrs] prefix and message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logFail('error message');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0]![0]).toContain('[openmrs]');
    expect(spy.mock.calls[0]![0]).toContain('error message');
  });
});
