import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigurableLink from "./react-configurable-link";
import { navigate, interpolateUrl } from "./navigate";

jest.mock("./navigate");
const mockNavigate = navigate as jest.Mock;
const mockInterpolateUrl = interpolateUrl as jest.Mock;
window.openmrsBase = "/openmrs";
window.spaBase = "/spa";
window.getOpenmrsSpaBase = () => "/openmrs/spa";

describe(`ConfigurableLink`, () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it(`interpolates the link and calls navigate on normal click`, async () => {
    const path = "${openmrsSpaPath}/home";
    mockInterpolateUrl.mockReturnValue("/openmrs/spa/home");
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>
    );
    const link = screen.getByRole("link", { name: /spa home/i });
    expect(link).toBeTruthy();
    expect(link.closest("a")).toHaveClass("fancy-link");
    expect(link.closest("a")).toHaveAttribute("href", "/openmrs/spa/home");
    userEvent.click(link, { button: 2 }); // right-click
    expect(navigate).not.toHaveBeenCalled();
    userEvent.click(link);
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });
});
