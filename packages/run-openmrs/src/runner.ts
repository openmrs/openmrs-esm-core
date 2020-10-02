import * as commands from "./commands";

process.on("message", ({ type, args }) => {
  const command = commands[type];

  if (typeof command === "function") {
    command(args);
  }
});
