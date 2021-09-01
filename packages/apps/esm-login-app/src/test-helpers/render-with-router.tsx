import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

export default function renderWithRouter(
  Component,
  props,
  {
    route = "/",
    routes = [route],
    history = createMemoryHistory({ initialEntries: routes }),
    routeParams = {},
  } = {}
) {
  return {
    ...render(
      <Router history={history}>
        <Route
          path={route}
          {...routeParams}
          component={(routeProps) => <Component {...routeProps} {...props} />}
        />
      </Router>
    ),
    history,
  };
}
