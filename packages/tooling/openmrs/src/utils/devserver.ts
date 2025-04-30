import { resolve } from 'path';
import { fork } from 'child_process';

export function startDevServer(source: string, port: number, cwd = process.cwd(), useRspack: boolean = false) {
  const runner = resolve(__dirname, 'debugger.js');
  const ps = fork(runner, [], { cwd });

  ps.send({ source, port, useRspack });

  return ps;
}
