import React from "react";
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

export default function renderWithRouter(
  Component,
  props,
  { route = "/", routes = [route], routeParams = {} } = {}
) {
  const history = createMemoryHistory();
  return {
    ...render(
      <MemoryRouter>
        <Component {...props} />
      </MemoryRouter>
    ),
    history,
  };
}
