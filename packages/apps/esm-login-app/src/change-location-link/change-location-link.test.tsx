import React from "react";
import ChangeLocationLink from "./change-location-link.component";
import { fireEvent, render, screen } from "@testing-library/react";
import { navigate } from "@openmrs/esm-framework";

const navigateMock = navigate as jest.Mock;

describe("<ChangeLocationLink/>", () => {
  const mockChangeLocationProps = {
    referer: "/openmrs/spa/home",
    currentLocation: "UnKnown Location",
  };

  beforeEach(() => {
    render(
      <ChangeLocationLink
        referer={mockChangeLocationProps.referer}
        currentLocation={mockChangeLocationProps.currentLocation}
      />
    );
  });

  it("should display the `Change location` link", async () => {
    const changeLocationButton = await screen.findByRole("button", {
      name: /Change/i,
    });

    fireEvent.click(changeLocationButton);

    expect(navigateMock).toHaveBeenCalledWith({
      to: "${openmrsSpaBase}/login/location?returnToUrl=/openmrs/spa/home",
    });
  });
});
