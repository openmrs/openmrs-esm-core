import { resolve } from "path";
import { fork } from "child_process";

export function startWebpack(
  source: string,
  port: number,
  cwd = process.cwd()
) {
  const runner = resolve(__dirname, "debugger.js");
  const ps = fork(runner, [], { cwd });

  ps.send({ source, port });

  return ps;
}
