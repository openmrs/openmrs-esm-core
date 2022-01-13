import {
  reportFileSizeImpact,
  readGitHubWorkflowEnv,
} from "@jsenv/file-size-impact";

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: "npx lerna run build",
  installCommand: "echo 'Everything installed'",
  fileSizeReportModulePath: "./size-generator.mjs",
});
