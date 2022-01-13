import {
  reportFileSizeImpact,
  readGitHubWorkflowEnv,
} from "@jsenv/file-size-impact";

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: "npm run build",
  installCommand: "echo 'Everything installed'",
  fileSizeReportModulePath: "./size-generator.mjs",
});
