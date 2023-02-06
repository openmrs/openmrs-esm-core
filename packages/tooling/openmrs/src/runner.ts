import * as commands from "./commands";
import { logFail } from "./utils";

type Commands = typeof commands;
type CommandNames = keyof Commands;
interface HandleMessageArgs<T extends CommandNames> {
  type: T;
  args: Parameters<Commands[T]>[0];
}

process.on(
  "message",
  async <T extends CommandNames>({ type, args }: HandleMessageArgs<T>) => {
    const command: (a: typeof args) => Promise<unknown> = commands[type];

    if (typeof command === "function") {
      try {
        await command(args);
        process.exit(0);
      } catch (err) {
        logFail(err.message);
        process.exit(1);
      }
    }
  }
);
