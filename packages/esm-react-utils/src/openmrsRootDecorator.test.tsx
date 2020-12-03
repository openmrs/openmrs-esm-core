import React, { ComponentType } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { openmrsRootDecorator } from "./openmrsRootDecorator";
import { ModuleNameContext } from "./ModuleNameContext";

describe("openmrs-react-root-decorator", () => {
  const opts = {
    featureName: "Test",
    throwErrorsToConsole: false,
    moduleName: "test",
  };

  it("renders a component", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompThatWorks);
    render(<DecoratedComp />);
    waitFor(() => {
      expect(screen.getByText("The button")).toBeTruthy();
    });
  });

  it("catches any errors in the component tree and renders a ui explaining something bad happened", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompThatThrows);
    render(<DecoratedComp />);
    // TO-DO assert the UX for broken react app is showing
  });

  it("provides ModuleNameContext", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompWithConfig);
    render(<DecoratedComp />);
  });
});

function CompThatWorks() {
  return <button>The button</button>;
}

let CompThatThrows = function () {
  throw Error("ahahaa");
};

function CompWithConfig() {
  const moduleName = React.useContext(ModuleNameContext);
  return <div>{moduleName}</div>;
}
