import { describe, expect, it, vi } from 'vitest';
import { isPortAvailable, getAvailablePort } from './port';

/**
 * Creates a mock server whose listen() triggers either the 'listening' or 'error' event
 * depending on the `shouldSucceed` parameter. The close() callback fires immediately.
 */
function createMockServer(shouldSucceed: boolean) {
  const handlers: Record<string, () => void> = {};
  return {
    once: vi.fn((event: string, handler: () => void) => {
      handlers[event] = handler;
    }),
    listen: vi.fn(() => {
      if (shouldSucceed) {
        handlers['listening']?.();
      } else {
        handlers['error']?.();
      }
    }),
    close: vi.fn((cb: () => void) => cb()),
  };
}

vi.mock('node:net', () => ({
  createServer: vi.fn(),
}));

// Import after mock declaration so vitest applies the mock
import { createServer } from 'node:net';
const mockCreateServer = vi.mocked(createServer);

describe('isPortAvailable', () => {
  it('returns true when both IPv4 and IPv6 binds succeed', async () => {
    const ipv4Server = createMockServer(true);
    const ipv6Server = createMockServer(true);
    mockCreateServer.mockReturnValueOnce(ipv4Server as any).mockReturnValueOnce(ipv6Server as any);

    await expect(isPortAvailable(3000)).resolves.toBe(true);

    expect(ipv4Server.listen).toHaveBeenCalledWith(3000, 'localhost');
    expect(ipv6Server.listen).toHaveBeenCalledWith(3000, '::1');
  });

  it('returns false when the IPv4 bind fails', async () => {
    const ipv4Server = createMockServer(false);
    mockCreateServer.mockReturnValueOnce(ipv4Server as any);

    await expect(isPortAvailable(3000)).resolves.toBe(false);

    expect(ipv4Server.listen).toHaveBeenCalledWith(3000, 'localhost');
  });

  it('returns false when the IPv6 bind fails', async () => {
    const ipv4Server = createMockServer(true);
    const ipv6Server = createMockServer(false);
    mockCreateServer.mockReturnValueOnce(ipv4Server as any).mockReturnValueOnce(ipv6Server as any);

    await expect(isPortAvailable(3000)).resolves.toBe(false);
  });
});

describe('getAvailablePort', () => {
  it('returns the start port when it is available', async () => {
    const ipv4 = createMockServer(true);
    const ipv6 = createMockServer(true);
    mockCreateServer.mockReturnValueOnce(ipv4 as any).mockReturnValueOnce(ipv6 as any);

    await expect(getAvailablePort(8080)).resolves.toBe(8080);
  });

  it('skips occupied ports and returns the next available one', async () => {
    // Port 8080: IPv4 fails
    const occupied = createMockServer(false);
    // Port 8081: both succeed
    const ipv4 = createMockServer(true);
    const ipv6 = createMockServer(true);

    mockCreateServer
      .mockReturnValueOnce(occupied as any)
      .mockReturnValueOnce(ipv4 as any)
      .mockReturnValueOnce(ipv6 as any);

    await expect(getAvailablePort(8080)).resolves.toBe(8081);
  });

  it('throws when no port is available up to 65535', async () => {
    // All ports fail
    mockCreateServer.mockImplementation(() => createMockServer(false) as any);

    await expect(getAvailablePort(65535)).rejects.toThrow('Could not find an available port');
  });
});
