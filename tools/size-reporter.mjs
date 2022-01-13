import {
  reportFileSizeImpact,
  readGitHubWorkflowEnv,
} from "@jsenv/file-size-impact";

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: "npm run build",
  fileSizeReportModulePath: "./size-generator.mjs",
});
