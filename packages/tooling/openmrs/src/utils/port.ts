import { createServer } from 'node:net';

const MAX_PORT = 65535;

/**
 * Checks if a port is available for use by attempting to bind to it.
 * Checks both IPv4 (0.0.0.0) and IPv6 (::) to ensure the port is truly available.
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

        server6.once('error', () => {
          resolve(false);
        });

        server6.once('listening', () => {
          server6.close(() => {
            resolve(true);
          });
        });

        server6.listen(port, '::');
      });
    });

    server.listen(port, '0.0.0.0');
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
