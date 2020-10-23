import "./backend-dependencies/openmrs-backend-dependencies";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./root.component";
import singleSpaReact from "single-spa-react";

const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
});

export { bootstrap, mount, unmount };
