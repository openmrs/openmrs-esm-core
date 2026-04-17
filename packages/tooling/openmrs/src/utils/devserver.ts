import { resolve } from 'path';
import { fork } from 'child_process';

export function startDevServer(source: string, port: number, cwd = process.cwd(), useRspack: boolean = false) {
  const runner = resolve(import.meta.dirname, 'debugger.js');
  const ps = fork(runner, [], { cwd });

  ps.send({ source, port, useRspack });

  const ready = new Promise<void>((resolve, reject) => {
    ps.on('message', (msg: { type: string }) => {
      if (msg.type === 'compilation-complete') {
        resolve();
      }
    });
    ps.on('error', reject);
    ps.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Dev server process exited with code ${code}`));
      }
    });
  });

  return { process: ps, ready };
}
