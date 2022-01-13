import { generateFileSizeReport } from "@jsenv/file-size-impact";

export const filesizeReport = await generateFileSizeReport({
  log: process.argv.includes("--log"),
  projectDirectoryUrl: new URL("../", import.meta.url),
  manifestConfig: {
    "./packages/apps/*/dist/*.buildmanifest.json": true,
    "./packages/shell/*/dist/*.buildmanifest.json": true,
  },
  trackingConfig: {
    // all modules
    modules: {
      "./packages/apps/*/dist/*.js": true,
      "./packages/apps/*/dist/*.css": true,
      "./packages/apps/*/dist/*.map": false,
      "./packages/apps/*/dist/*.json": false,
    },
    // all apps (should be only app-shell)
    apps: {
      "./packages/shell/*/dist/*.js": true,
      "./packages/shell/*/dist/*.css": true,
      "./packages/shell/*/dist/*.map": false,
      "./packages/shell/*/dist/*.json": false,
    },
  },
});
