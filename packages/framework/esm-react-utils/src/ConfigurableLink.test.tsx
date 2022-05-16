import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { navigate, interpolateUrl } from "@openmrs/esm-config";
import userEvent from "@testing-library/user-event";
import { ConfigurableLink } from "./ConfigurableLink";

jest.mock("single-spa");

jest.mock("@openmrs/esm-config");
const mockNavigate = navigate as jest.Mock;

const realInterpolate = jest.requireActual(
  "@openmrs/esm-config"
).interpolateUrl;

(interpolateUrl as jest.Mock).mockImplementation((...args) =>
  realInterpolate(...args)
);

describe(`ConfigurableLink`, () => {
  const path = "${openmrsSpaBase}/home";
  beforeEach(() => {
    mockNavigate.mockClear();
    render(
      <ConfigurableLink to={path} className="fancy-link">
        SPA Home
      </ConfigurableLink>
    );
  });

  it(`interpolates the link`, async () => {
    const link = screen.getByRole("link", { name: /spa home/i });
    expect(link).toBeTruthy();
    expect(link.closest("a")).toHaveClass("fancy-link");
    expect(link.closest("a")).toHaveAttribute("href", "/openmrs/spa/home");
  });

  it(`calls navigate on normal click but not special clicks`, async () => {
    const link = screen.getByRole("link", { name: /spa home/i });
    await userEvent.pointer({ target: link, keys: "[MouseRight]" });
    expect(navigate).not.toHaveBeenCalled();
    await userEvent.click(link);
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });

  it(`calls navigate on enter`, async () => {
    expect(navigate).not.toHaveBeenCalled();
    const link = screen.getByRole("link", { name: /spa home/i });
    await userEvent.type(link, "{enter}");
    expect(navigate).toHaveBeenCalledWith({ to: path });
  });
});
