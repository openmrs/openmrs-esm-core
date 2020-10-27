import React from "react";
import { openmrsRootDecorator } from "@openmrs/esm-context";
import Devtools from "./devtools/devtools.component";

function Root(props) {
  return <Devtools {...props} />;
}

export default openmrsRootDecorator({
  featureName: "devtools",
  moduleName: "@openmrs/esm-devtools-app",
})(Root);
