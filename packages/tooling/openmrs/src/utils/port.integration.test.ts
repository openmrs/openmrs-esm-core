import { createServer } from 'node:net';
import { describe, expect, it } from 'vitest';
import { isPortAvailable } from './port';

describe('isPortAvailable with real sockets', () => {
  it('rejects a port occupied on the IPv4 loopback', async () => {
    const server = createServer();

    try {
      await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
      });

      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('Expected a TCP server address');
      }

      await expect(isPortAvailable(address.port)).resolves.toBe(false);
    } finally {
      if (server.listening) {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        });
      }
    }
  });
});
