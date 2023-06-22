import { useState } from "react";
import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useConfig, useSession } from "@openmrs/esm-framework";
import { performLogin } from "../login.resource";
import { mockConfig } from "../../__mocks__/config.mock";
import renderWithRouter from "../test-helpers/render-with-router";
import Login from "./login.component";

const mockedLogin = performLogin as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;
const mockedUseSession = useSession as jest.Mock;

jest.mock("@openmrs/esm-framework", () => {
  const originalModule = jest.requireActual("@openmrs/esm-framework");

  return {
    ...originalModule,
    clearCurrentUser: jest.fn(),
    refetchCurrentUser: jest.fn().mockReturnValue(Promise.resolve()),
    getSessionStore: jest.fn().mockImplementation(() => {
      return {
        getState: jest.fn().mockReturnValue({
          session: {
            authenticated: true,
          },
        }),
      };
    }),
  };
});

jest.mock("../login.resource", () => ({
  performLogin: jest.fn(),
}));

const loginLocations = [
  { uuid: "111", display: "Earth" },
  { uuid: "222", display: "Mars" },
];

mockedUseSession.mockReturnValue({ authenticated: false });
mockedUseConfig.mockReturnValue(mockConfig);

describe("Login", () => {
  it("renders the login form", () => {
    renderWithRouter(Login);

    screen.getByRole("img", { name: /OpenMRS logo/i });
    expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    screen.getByRole("textbox", { name: /Username/i });
    screen.getByRole("button", { name: /Continue/i });
  });

  it("renders a configurable logo", () => {
    const customLogoConfig = {
      src: "https://some-image-host.com/foo.png",
      alt: "Custom logo",
    };
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      logo: customLogoConfig,
    });

    renderWithRouter(Login);

    const logo = screen.getByAltText(customLogoConfig.alt);

    expect(screen.queryByTitle(/openmrs logo/i)).not.toBeInTheDocument();
    expect(logo).toHaveAttribute("src", customLogoConfig.src);
    expect(logo).toHaveAttribute("alt", customLogoConfig.alt);
  });

  it("should return user focus to username input when input is invalid", async () => {
    renderWithRouter(
      Login,
      {},
      {
        route: "/login",
        routes: ["/login", "/login/confirm"],
      }
    );
    const user = userEvent.setup();

    expect(
      screen.getByRole("textbox", { name: /username/i })
    ).toBeInTheDocument();
    // no input to username
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);
    expect(screen.getByRole("textbox", { name: /username/i })).toHaveFocus();
    await user.type(
      screen.getByRole("textbox", { name: /username/i }),
      "yoshi"
    );
    await user.click(continueButton);
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), "no-tax-fraud");
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
  });

  it("makes an API request when you submit the form", async () => {
    mockedLogin.mockReturnValue(Promise.resolve({ some: "data" }));

    renderWithRouter(
      Login,
      {},
      {
        route: "/login",
        routes: ["/login", "/login/confirm"],
      }
    );
    const user = userEvent.setup();

    expect(performLogin).not.toHaveBeenCalled();
    await user.type(
      screen.getByRole("textbox", { name: /Username/i }),
      "yoshi"
    );
    await user.click(screen.getByRole("button", { name: /Continue/i }));

    const loginButton = screen.getByRole("button", { name: /log in/i });
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), "no-tax-fraud");
    await user.click(loginButton);
    await waitFor(() =>
      expect(performLogin).toHaveBeenCalledWith("yoshi", "no-tax-fraud")
    );
  });

  it("sends the user to the location select page on login if there is more than one location", async () => {
    let refreshUser = (user: any) => {};
    mockedLogin.mockImplementation(() => {
      refreshUser({
        display: "my name",
      });
      return Promise.resolve({ data: { authenticated: true } });
    });
    mockedUseSession.mockImplementation(() => {
      const [user, setUser] = useState();
      refreshUser = setUser;
      return { user, authenticated: !!user };
    });

    renderWithRouter(
      Login,
      {},
      {
        routeParams: {
          path: "/login(/confirm)?",
          exact: true,
        },
        routes: ["/login", "/login/confirm"],
      }
    );

    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /Username/i }),
      "yoshi"
    );
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), "no-tax-fraud");
    await user.click(screen.getByRole("button", { name: /log in/i }));
  });
});
