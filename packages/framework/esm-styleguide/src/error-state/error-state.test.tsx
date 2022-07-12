/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorState } from ".";

describe("ErrorState: ", () => {
  it("renders an error state widget card", () => {
    const testError = {
      response: {
        status: 500,
        statusText: "Internal Server Error",
      },
    };
    render(<ErrorState headerTitle="appointments" error={testError} />);

    expect(
      screen.getByRole("heading", { name: /appointments/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Error 500: Internal Server Error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above./i
      )
    ).toBeInTheDocument();
  });
});
