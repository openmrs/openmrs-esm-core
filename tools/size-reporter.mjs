import {
  reportFileSizeImpact,
  readGitHubWorkflowEnv,
} from "@jsenv/file-size-impact";

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: "npx turbo run build",
  installCommand: "yarn install --immutable",
  fileSizeReportUrl: new URL(
    "./tools/size-generator.mjs#fileSizeReport",
    import.meta.url
  ),
  rootDirectoryUrl: new URL("../", import.meta.url),
});
