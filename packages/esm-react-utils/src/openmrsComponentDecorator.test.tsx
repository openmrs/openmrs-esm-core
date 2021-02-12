import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { openmrsComponentDecorator } from "./openmrsComponentDecorator";
import { ComponentContext } from "./ComponentContext";

describe("openmrs-component-decorator", () => {
  const opts = {
    featureName: "Test",
    throwErrorsToConsole: false,
    moduleName: "test",
  };

  it("renders a component", () => {
    const DecoratedComp = openmrsComponentDecorator(opts)(CompThatWorks);
    render(<DecoratedComp />);
    waitFor(() => {
      expect(screen.getByText("The button")).toBeTruthy();
    });
  });

  it("catches any errors in the component tree and renders a ui explaining something bad happened", () => {
    const DecoratedComp = openmrsComponentDecorator(opts)(CompThatThrows);
    render(<DecoratedComp />);
    // TO-DO assert the UX for broken react app is showing
  });

  it("provides ComponentContext", () => {
    const DecoratedComp = openmrsComponentDecorator(opts)(CompWithConfig);
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
  const { moduleName } = React.useContext(ComponentContext);
  return <div>{moduleName}</div>;
}
