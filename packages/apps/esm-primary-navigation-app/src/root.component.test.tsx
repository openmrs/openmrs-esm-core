import React from "react";
import {
  fireEvent,
  render,
  screen,
  wait,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { of } from "rxjs";
import { isDesktop } from "./utils";
import { mockUser } from "../__mocks__/mock-user";
import { mockSession } from "../__mocks__/mock-session";
import Root from "./root.component";

const mockUserObservable = of(mockUser);
const mockSessionObservable = of({ data: mockSession });

jest.mock("@openmrs/esm-framework", () => ({
  openmrsFetch: jest.fn().mockResolvedValue({}),
  useAssignedExtensionIds: jest.fn().mockResolvedValue([]),
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
  refetchCurrentUser: jest.fn(),
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

describe(`<Root />`, () => {
  beforeEach(() => {
    render(<Root />);
  });

  it("should display navbar with title", async () => {
    expect(screen.getByRole("button", { name: /Users/i })).toBeInTheDocument();
    expect(
      screen.getByRole("banner", { name: /OpenMRS/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Mock EMR/i)).toBeInTheDocument();
  });

  it("should open user-menu panel", async () => {
    const userButton = await screen.findByRole("button", { name: /Users/i });
    fireEvent.click(userButton);
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });

  describe("when view is desktop", () => {
    beforeEach(() => {
      (isDesktop as jest.Mock).mockImplementation(() => true);
    });

    it("does not render side menu button if desktop", async () => {
      await wait(() =>
        expect(screen.queryAllByLabelText("Open menu")).toHaveLength(0)
      );
    });
  });
});
