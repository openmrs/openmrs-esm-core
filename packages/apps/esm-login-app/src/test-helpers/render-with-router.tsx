import React from "react";
import { Router, Route, Routes, MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

export default function renderWithRouter(
  Component,
  props,
  { route = "/" } = {}
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
