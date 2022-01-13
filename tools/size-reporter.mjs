import {
  reportFileSizeImpact,
  readGitHubWorkflowEnv,
} from "@jsenv/file-size-impact";

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: "npx lerna run build",
  installCommand: "npx lerna bootstrap",
  fileSizeReportModulePath: "./size-generator.mjs#fileSizeReport",
});
