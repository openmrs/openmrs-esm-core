import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as openMRSFramework from "@openmrs/esm-framework";
import { performLogin } from "./login.resource";
import { mockConfig } from "../../__mocks__/config.mock";
import renderWithRouter from "../test-helpers/render-with-router";
import Login from "./login.component";
import { Session } from "@openmrs/esm-framework";

const mockedLogin = performLogin as jest.Mock;

const mockSession: Session = {
  authenticated: false,
  user: null,
  sessionId: "some-session-id",
};
jest.mock("./login.resource", () => ({
  performLogin: jest.fn(),
}));

const loginLocations = [
  { uuid: "111", display: "Earth" },
  { uuid: "222", display: "Mars" },
];

describe(`<Login />`, () => {
  beforeEach(() => {
    mockedLogin.mockReset();
  });

  it(`renders a login form`, () => {
    spyOn(openMRSFramework, "useConfig").and.returnValue(mockConfig);
    renderWithRouter(Login, {
      loginLocations: loginLocations,
      isLoginEnabled: true,
    });

    screen.getByRole("img", { name: /OpenMRS logo/i });
    expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    screen.getByRole("textbox", { name: /Username/i });
    screen.getByRole("button", { name: /Continue/i });
  });

  it(`should return user focus to username input when input is invalid`, async () => {
    spyOn(openMRSFramework, "useConfig").and.returnValue(mockConfig);
    renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {
        route: "/",
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

  it(`makes an API request when you submit the form`, async () => {
    spyOn(openMRSFramework, "useConfig").and.returnValue(mockConfig);
    mockedLogin.mockReturnValue(Promise.resolve({ some: "data" }));

    renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {
        route: "/login",
      }
    );
    const user = userEvent.setup();

    expect(performLogin).not.toHaveBeenCalled();
    await user.type(
      screen.getByRole("textbox", { name: /Username/i }),
      "yoshi"
    );
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), "no-tax-fraud");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(performLogin).toHaveBeenCalledWith("yoshi", "no-tax-fraud")
    );
  });

  it(`sends the user to the location select page on login if there is more than one location`, async () => {
    spyOn(openMRSFramework, "useConfig").and.returnValue(mockConfig);
    spyOn(openMRSFramework, "useSession").and.returnValue(mockSession);

    const { container, history } = renderWithRouter(
      Login,
      {
        loginLocations: loginLocations,
        isLoginEnabled: true,
      },
      {}
    );
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /Username/i }),
      "yoshi"
    );
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    await screen.findByLabelText("password");
    await user.type(screen.getByLabelText("password"), "no-tax-fraud");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
    expect(screen.getByLabelText("password")).toHaveTextContent("");
    );
  });

  it("respects the logo configuration", () => {
    const customLogoConfig = {
      src: "https://some-image-host.com/foo.png",
      alt: "Custom logo",
    };
    spyOn(openMRSFramework, "useConfig").and.returnValue({
      ...mockConfig,
      logo: customLogoConfig,
    });

    renderWithRouter(Login, {
      loginLocations: loginLocations,
      isLoginEnabled: true,
    });

    const logo = screen.getByAltText(customLogoConfig.alt);

    expect(screen.queryByTitle(/openmrs logo/i)).not.toBeInTheDocument();
    expect(logo).toHaveAttribute("src", customLogoConfig.src);
    expect(logo).toHaveAttribute("alt", customLogoConfig.alt);
  });
});
