import React from "react";
import { of } from "rxjs";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isDesktop } from "./utils";
import { mockUser } from "../__mocks__/mock-user";
import { mockSession } from "../__mocks__/mock-session";
import Root from "./root.component";

const mockUserObservable = of(mockUser);
const mockSessionObservable = of({ data: mockSession });

jest.mock("@openmrs/esm-framework", () => ({
  openmrsFetch: jest.fn().mockResolvedValue({}),
  useAssignedExtensions: jest.fn().mockReturnValue([]),
  createErrorHandler: jest.fn(),
  openmrsObservableFetch: jest.fn(),
  getCurrentUser: jest.fn(() => mockUserObservable),
  ExtensionSlot: jest
    .fn()
    .mockImplementation(({ children }) => <>{children}</>),
  useLayoutType: jest.fn(() => "tablet"),
  useConfig: jest.fn(() => ({
    logo: { src: null, alt: null, name: "Mock EMR" },
  })),
  useOnClickOutside: jest.fn(() => {
    const { useRef } = require("react");
    return useRef();
  }),
  useSession: jest.fn().mockReturnValue(mockSession),
  refetchCurrentUser: jest.fn(),
  subscribeConnectivity: jest.fn(),
  navigate: jest.fn(),
  ConfigurableLink: jest.fn(() => {
    return <a href="#">Mock EMR</a>;
  }),
}));

jest.mock("./root.resource", () => ({
  getSynchronizedCurrentUser: jest.fn(() => mockUserObservable),
  getCurrentSession: jest.fn(() => mockSessionObservable),
}));

jest.mock("./offline", () => ({
  syncUserPropertiesChanges: () => Promise.resolve({}),
}));

jest.mock("./utils", () => ({
  isDesktop: jest.fn(() => true),
}));

describe("Root", () => {
  it("should display navbar with title", async () => {
    render(<Root />);

    expect(screen.getByRole("button", { name: /users/i })).toBeInTheDocument();
    expect(
      screen.getByRole("banner", { name: /openmrs/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/mock emr/i)).toBeInTheDocument();
  });

  it("should open user-menu panel", async () => {
    const user = userEvent.setup();

    render(<Root />);

    const userButton = screen.getByRole("button", { name: /users/i });
    await user.click(userButton);
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  describe("when view is desktop", () => {
    beforeEach(() => {
      (isDesktop as jest.Mock).mockImplementation(() => true);
    });

    it("does not render side menu button if desktop", async () => {
      await waitFor(() =>
        expect(screen.queryAllByLabelText("Open menu")).toHaveLength(0)
      );
    });
  });
});
