import React from "react";
import UserPanelSwitcher from "./user-panel-switcher.component";
import { screen, render } from "@testing-library/react";
import { mockLoggedInUser } from "../../../__mocks__/mock-user";

describe("<UserPanelSwitcher/>", () => {
  beforeEach(() => {
    render(<UserPanelSwitcher user={mockLoggedInUser as any} />);
  });

  it("should display user name", async () => {
    expect(await screen.findByText(/Dr Healther Morgan/i)).toBeInTheDocument();
  });
});
