import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'events';
import { fork } from 'child_process';
import { startDevServer } from './devserver';

vi.mock('child_process', () => ({
  fork: vi.fn(),
}));

describe('startDevServer', () => {
  it('forks runner with correct options and sends initialization message', async () => {
    const mockProcess: any = Object.assign(new EventEmitter(), {
      send: vi.fn(),
    });
    vi.mocked(fork).mockReturnValue(mockProcess);

    const { process: ps, ready } = startDevServer('/path/to/source.js', 8080, '/custom/cwd', true);

    expect(fork).toHaveBeenCalledWith(
      expect.stringContaining('debugger.js'),
      [],
      { cwd: '/custom/cwd' },
    );
    expect(ps.send).toHaveBeenCalledWith({
      source: '/path/to/source.js',
      port: 8080,
      useRspack: true,
    });

    // Simulate successful compilation message
    mockProcess.emit('message', { type: 'compilation-complete' });
    await expect(ready).resolves.toBeUndefined();
  });

  it('rejects ready promise if child process emits an error', async () => {
    const mockProcess: any = Object.assign(new EventEmitter(), {
      send: vi.fn(),
    });
    vi.mocked(fork).mockReturnValue(mockProcess);

    const { ready } = startDevServer('/path/to/source.js', 3000);

    const err = new Error('Process spawn error');
    mockProcess.emit('error', err);

    await expect(ready).rejects.toThrow('Process spawn error');
  });

  it('rejects ready promise if child process exits with non-zero code', async () => {
    const mockProcess: any = Object.assign(new EventEmitter(), {
      send: vi.fn(),
    });
    vi.mocked(fork).mockReturnValue(mockProcess);

    const { ready } = startDevServer('/path/to/source.js', 3000);

    mockProcess.emit('exit', 1);

    await expect(ready).rejects.toThrow('Dev server process exited with code 1');
  });
});
