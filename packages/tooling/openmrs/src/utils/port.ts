import { createServer } from 'node:net';

const MAX_PORT = 65535;

/**
 * Whether a bind error means the host has no IPv6 loopback to bind to, as opposed to the port
 * being taken. `EAFNOSUPPORT` is what an IPv6-disabled host reports, and `EADDRNOTAVAIL` is what
 * one with IPv6 enabled but no `::1` on its loopback interface reports.
 */
function isIpv6Unavailable(err: NodeJS.ErrnoException) {
  return err.code === 'EAFNOSUPPORT' || err.code === 'EADDRNOTAVAIL';
}

/**
 * Checks if a port is available for use by attempting to bind to it.
 * Checks both IPv4 (localhost) and IPv6 (::1) to ensure the port is truly available. On hosts
 * without IPv6, only the IPv4 check applies.
 * @param port The port number to check
 * @returns A promise that resolves to true if the port is available, false otherwise
 */
export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      // Port is available on IPv4, now check IPv6
      server.close(() => {
        const server6 = createServer();

        server6.once('error', (err: NodeJS.ErrnoException) => {
          // Without IPv6 there is nothing on ::1 to collide with, so the IPv4 result stands
          resolve(isIpv6Unavailable(err));
        });

        server6.once('listening', () => {
          server6.close(() => {
            resolve(true);
          });
        });

        server6.listen(port, '::1');
      });
    });

    server.listen(port, 'localhost');
  });
}

/**
 * Finds the next available port starting from the given port.
 * @param startPort The port number to start searching from
 * @returns A promise that resolves to an available port number
 * @throws Error if no available port is found up to port 65535
 */
export async function getAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port <= MAX_PORT; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`Could not find an available port between ${startPort} and ${MAX_PORT}`);
}
