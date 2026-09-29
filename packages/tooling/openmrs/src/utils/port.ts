import { createServer } from 'node:net';

const MAX_PORT = 65535;

/**
 * Whether a bind error means the host has no loopback address of that family to bind to, as
 * opposed to the port being taken. `EAFNOSUPPORT` is what a host with the address family disabled
 * reports, and `EADDRNOTAVAIL` is what one with it enabled but no loopback address for it reports.
 */
function isAddressFamilyUnavailable(err: NodeJS.ErrnoException) {
  return err.code === 'EAFNOSUPPORT' || err.code === 'EADDRNOTAVAIL';
}

/**
 * Binds and releases `port` on `host`. Resolves to `'bound'` if that worked, `'unavailable'` if the
 * host has no loopback address of that family, and `'failed'` for any other error, including the
 * port being in use.
 */
function tryBind(port: number, host: string): Promise<'bound' | 'unavailable' | 'failed'> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      resolve(isAddressFamilyUnavailable(err) ? 'unavailable' : 'failed');
    });

    server.once('listening', () => {
      server.close(() => {
        resolve('bound');
      });
    });

    server.listen(port, host);
  });
}

/**
 * Checks if a port is available for use by attempting to bind to it.
 * Checks both IPv4 (127.0.0.1) and IPv6 (::1) to ensure the port is truly available. On hosts
 * without one of those loopback addresses, only the other check applies.
 * @param port The port number to check
 * @returns A promise that resolves to true if the port is available, false otherwise
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  const ipv4 = await tryBind(port, '127.0.0.1');
  if (ipv4 === 'failed') {
    return false;
  }

  const ipv6 = await tryBind(port, '::1');
  if (ipv6 === 'failed') {
    return false;
  }

  // A missing address family has nothing on it to collide with, but at least one bind has to work
  return ipv4 === 'bound' || ipv6 === 'bound';
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
