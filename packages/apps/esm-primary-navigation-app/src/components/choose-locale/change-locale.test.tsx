import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChangeLocale } from "./change-locale.component";
import type { PostUserProperties } from "./change-locale.resource";

const allowedLocales = ["en", "fr", "it", "pt"];
const user: any = {
  uuid: "uuid",
  userProperties: {
    defaultLocale: "fr",
  },
};

describe(`<ChangeLocale />`, () => {
  let postUserPropertiesMock: PostUserProperties = jest.fn(() =>
    Promise.resolve()
  );

  it("should have user's defaultLocale as initial value", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());

    render(
      <ChangeLocale
        locale={"en"}
        allowedLocales={allowedLocales}
        user={user}
        postUserProperties={postUserPropertiesMock}
      />
    );
    expect(screen.getByLabelText(/Select locale/)).toHaveValue("fr");
  });

  it("should have session locale as initial value if no defaultLocale for user found", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());

    const wrapper = render(
      <ChangeLocale
        locale={"en"}
        allowedLocales={allowedLocales}
        user={{
          ...user,
          userProperties: {},
        }}
        postUserProperties={postUserPropertiesMock}
      />
    );
    expect(wrapper.getByLabelText(/Select locale/)).toHaveValue("en");
  });

  it("should change user locale", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());

    render(
      <ChangeLocale
        locale={"en"}
        allowedLocales={allowedLocales}
        user={user}
        postUserProperties={postUserPropertiesMock}
      />
    );
    expect(screen.getByLabelText(/Select locale/)).toHaveValue("fr");
    fireEvent.change(screen.getByLabelText(/Select locale/i), {
      target: { value: "en" },
    });
    await waitFor(() => {
      expect(postUserPropertiesMock).toHaveBeenCalledWith(
        user.uuid,
        { defaultLocale: "en" },
        expect.anything()
      );
    });
  });
});
