import * as commands from "./commands";
import { logFail } from "./utils";

process.on("message", async ({ type, args }) => {
  const command = commands[type];

  if (typeof command === "function") {
    try {
      await command(args);
      process.exit(0);
    } catch (err) {
      logFail(err.message);
      process.exit(1);
    }
  }
});
