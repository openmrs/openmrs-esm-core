import "@testing-library/jest-dom";
import Login from "./login.component";
import { cleanup } from "@testing-library/react";
import renderWithRouter from "../test-helpers/render-with-router";
import userEvent from "@testing-library/user-event";

jest.mock("../choose-location/choose-location.resource", () => ({
  setSessionLocation: jest.fn(),
}));

jest.mock("../CurrentUserContext", () => ({
  useCurrentUser: jest.fn(),
}));

const loginLocations = [
  { uuid: "111", display: "Earth" },
  { uuid: "222", display: "Mars" },
];

describe(`<Login />`, () => {
  afterEach(cleanup);

  it(`renders a login form`, () => {
    const wrapper = renderWithRouter(Login, {
      loginLocations: loginLocations,
      isLoginEnabled: true,
    });

    wrapper.getByRole("textbox", { name: /Username/i });
    wrapper.getByRole("button", { name: /Continue/i });
  });

  it(`should return user focus to username input when input is invalid`, () => {
    const wrapper = renderWithRouter(Login, {
      loginLocations: loginLocations,
      isLoginEnabled: true,
    });

    expect(
      wrapper.getByRole("textbox", { name: /username/i })
    ).toBeInTheDocument();
    userEvent.type(wrapper.getByRole("textbox", { name: /Username/i }), "");
    const continueButton = wrapper.getByRole("button", { name: /Continue/i });
    userEvent.click(continueButton);
    expect(wrapper.getByRole("textbox", { name: /username/i })).toHaveFocus();
    userEvent.type(
      wrapper.getByRole("textbox", { name: /Username/i }),
      "yoshi"
    );
    userEvent.click(continueButton);
    userEvent.type(wrapper.getByLabelText("password"), "yoshi");
    expect(wrapper.getByLabelText(/password/i)).toHaveFocus();
  });
});
