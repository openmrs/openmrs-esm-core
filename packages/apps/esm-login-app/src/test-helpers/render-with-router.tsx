import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

export default function renderWithRouter(
  Component,
  props,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(
      <Router history={history}>
        {<Component {...props} history={history} />}
      </Router>
    ),
    history,
  };
}
