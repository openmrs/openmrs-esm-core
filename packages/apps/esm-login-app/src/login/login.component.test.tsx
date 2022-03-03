import "@testing-library/jest-dom";
import Login from "./login.component";
import { useState } from "react";
import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setSessionLocation, useConfig } from "@openmrs/esm-framework";
import { performLogin } from "./login.resource";
import { useCurrentUser } from "../CurrentUserContext";
import { mockConfig } from "../../__mocks__/config.mock";
import renderWithRouter from "../test-helpers/render-with-router";

const mockedLogin = performLogin as jest.Mock;

jest.mock("./login.resource", () => ({
  performLogin: jest.fn(),
}));

const mockedSetSessionLocation = setSessionLocation as jest.Mock;
const mockedUseCurrentUser = useCurrentUser as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;

jest.mock("../CurrentUserContext", () => ({
  useCurrentUser: jest.fn(),
}));

const loginLocations = [
  { uuid: "111", display: "Earth" },
  { uuid: "222", display: "Mars" },
];

describe(`<Login />`, () => {
  beforeEach(() => {
    mockedLogin.mockReset();
    mockedSetSessionLocation.mockReset();
    mockedUseCurrentUser.mockReset();
    mockedUseConfig.mockReturnValue(mockConfig);
  });

  it(`renders a login form`, () => {
    renderWithRouter(Login, {
      loginLocations: loginLocations,
      isLoginEnabled: true,
    });

    screen.getByRole("img", { name: /OpenMRS svg/i });
    expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    screen.getByRole("textbox", { name: /Username/i });
    screen.getByRole("button", { name: /Continue/i });
  });

  it(`should return user focus to username input when input is invalid`, () => {
    renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {
        route: "/login",
        routes: ["/login", "/login/confirm"],
      }
    );

    expect(
      screen.getByRole("textbox", { name: /username/i })
    ).toBeInTheDocument();
    userEvent.type(screen.getByRole("textbox", { name: /Username/i }), "");
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    userEvent.click(continueButton);
    expect(screen.getByRole("textbox", { name: /username/i })).toHaveFocus();
    userEvent.type(screen.getByRole("textbox", { name: /Username/i }), "yoshi");
    userEvent.click(continueButton);
    userEvent.type(screen.getByLabelText("password"), "yoshi");
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
  });

  it(`makes an API request when you submit the form`, async () => {
    mockedLogin.mockReturnValue(Promise.resolve({ some: "data" }));

    renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {
        route: "/login",
        routes: ["/login", "/login/confirm"],
      }
    );

    expect(performLogin).not.toHaveBeenCalled();
    userEvent.type(screen.getByRole("textbox", { name: /Username/i }), "yoshi");
    userEvent.click(screen.getByRole("button", { name: /Continue/i }));
    userEvent.type(screen.getByLabelText("password"), "no-tax-fraud");
    userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(performLogin).toHaveBeenCalledWith("yoshi", "no-tax-fraud")
    );
  });

  it(`sends the user to the location select page on login if there is more than one location`, async () => {
    let refreshUser = (user: any) => {};
    mockedLogin.mockImplementation(() => {
      refreshUser({
        display: "my name",
      });
      return Promise.resolve({ data: { authenticated: true } });
    });
    mockedUseCurrentUser.mockImplementation(() => {
      const [user, setUser] = useState();
      refreshUser = setUser;
      return user;
    });

    const wrapper = renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {
        routeParams: {
          path: "/login(/confirm)?",
          exact: true,
        },
        routes: ["/login", "/login/confirm"],
      }
    );

    userEvent.type(screen.getByRole("textbox", { name: /Username/i }), "yoshi");
    userEvent.click(screen.getByRole("button", { name: /Continue/i }));
    userEvent.type(screen.getByLabelText("password"), "no-tax-fraud");
    userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(wrapper.history.location.pathname).toBe("/login/location")
    );
  });
});
